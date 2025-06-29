class Api::V1::RequestsController < ApplicationController
  include Pundit::Authorization
  before_action :set_request,
                only: %i[show update pair clone delete_image images]

  def index
    case Current.user.role
    when "admin", "manager"
      render_admin_index
    when "customer"
      render_customer_index
    when "foreman"
      render_foreman_index
    when "driver", "helper"
      render_mover_index
    else
      json_error({ message: "Unauthorized" }, :forbidden)
    end
  end

  def show
    authorize @request
    render json: @request, status: :ok
  end

  def create
    @request = Request.new(request_params.except(:id))
    @request.packing = Packing.find_by(index: 0)
    authorize @request

    if @request.save
      render json: @request, status: :created
    else
      render json: @request.errors, status: :unprocessable_entity
    end
  end

  def pair
    authorize @request
    paired_request = Request.find(params[:paired_request_id])

    if @request.pair_with(paired_request)
      render json: { success: true }, status: :ok
    else
      render json: @request.errors, status: :unprocessable_entity
    end
  end

  def unpair
    Request.transaction do
      request1 = Request.find(params[:request_id])
      request2 = Request.find(params[:paired_request_id])

      authorize request1

      request1.update!(paired_request_id: nil, is_moving_from_storage: false)
      request2.update!(paired_request_id: nil, is_moving_from_storage: false)
    end

    render json: { success: true }, status: :ok
  rescue => e
    render json: { message: e.message }, status: :unprocessable_entity
  end

  def clone
    authorize @request
    cloned = @request.dup
    cloned.moving_date = nil
    cloned.status = "pending"
    cloned.save!

    # clone associations as needed
    @request.request_extra_services.each do |extra|
      cloned.request_extra_services << extra.dup
    end

    render json: cloned, status: :created
  end

  def update
    authorize @request
    if @request.update(request_params)
      render json: @request, status: :ok
    else
      render json: @request.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @request = Request.find(params[:id])
    authorize @request
    @request.destroy
    head :no_content
  end

  def status_counts
    authorize Request

    pending_statuses = %w[pending pending_info pending_date hold]
    total_requests_count = Request.group(:status).count

    # Aggregate all pending-like statuses under "pending"
    total_requests_count["pending"] = total_requests_count
      .slice(*pending_statuses)
      .values
      .sum

    # Remove individual counts of pending_info, pending_date, and hold
    pending_statuses[1..].each { |status| total_requests_count.delete(status) }

    # Add total count
    total_requests_count["all"] = Request.count

    render json: total_requests_count, status: :ok
  end

  # POST /api/v1/requests/:id/images
  def images
    authorize @request
    if params[:images]
      params[:images].each { |image| @request.images.attach(image) }
    end

    if @request.save
      render json: @request, status: :ok
    else
      render json: @request.errors.full_messages, status: :unprocessable_entity
    end
  end

  def delete_image
    authorize @request
    image = @request.images.find(params[:image_id])

    if image.purge
      render json: @request, status: :ok
    else
      render json: { message: "Failed to delete image" }, status: :unprocessable_entity
    end
  end

  private

  def filter_requests(requests, filter, per_page)
    case filter
    when "all"
      total_pages = (Request.count.to_f / per_page).ceil
    when "pending"
      pending_statuses = %w[pending pending_info pending_date hold]
      requests = requests.where(status: pending_statuses)
      total_pages =
        (Request.where(status: pending_statuses).count.to_f / per_page).ceil
    when filter
      requests = requests.where(status: filter)
      total_pages = (Request.where(status: filter).count.to_f / per_page).ceil
    else
      total_pages = (Request.count.to_f / per_page).ceil
    end

    [ requests, total_pages ]
  end

  def render_admin_index
    filter = params[:filter]
    per_page = 20
    page = (params[:page] || 1).to_i

    requests =
      Request.includes(:customer).order(id: :desc).page(page).per(per_page)
    requests, total_pages = filter_requests(requests, filter, per_page)

    render_admin_requests(requests, total_pages)
  end

  def render_customer_index
    statuses = %w[pending pending_info pending_date hold confirmed not_confirmed completed]
    @requests = Current.user.requests_as_customer.where(status: statuses).order(id: :desc)
    policy_scope(Request).where(customer_id: Current.user.id).order(id: :desc)
    render_customer_requests(@requests)
  end

  def render_foreman_index
    @requests =
      policy_scope(Request).where(
        foreman_id: Current.user.id,
        status: :confirmed
      ).order(id: :desc)
    render_foreman_requests(@requests)
  end

  def render_mover_index
    @requests =
      policy_scope(Request)
        .where(status: :confirmed)
        .joins(:request_movers)
        .where(request_movers: { user_id: Current.user.id })
        .order(id: :desc)
    render_mover_requests(@requests)
  end

  def render_admin_requests(requests, total_pages)
    serialized_requests =
      ActiveModelSerializers::SerializableResource.new(
        requests,
        each_serializer: RequestTableSerializer
      )

    render json: (
      {
        requests: serialized_requests,
        pagination: {
          total_pages: total_pages,
          current_page: requests.current_page,
          total_count: requests.total_count
        }
      }
    ), status: :ok
  end

  def render_customer_requests(requests)
    serialized_requests =
      ActiveModelSerializers::SerializableResource.new(
        requests,
        each_serializer: CustomerRequestSerializer
      )
    render json: { requests: serialized_requests }, status: :ok
  end

  # TODO: Add foreman serializer
  def render_foreman_requests(requests)
    serialized_requests =
      ActiveModelSerializers::SerializableResource.new(
        requests,
        each_serializer: CustomerRequestSerializer
      )
    render json: { requests: serialized_requests }, status: :ok
  end

  # TODO: Add mover serializer
  def render_mover_requests(requests)
    serialized_requests =
      ActiveModelSerializers::SerializableResource.new(
        requests,
        each_serializer: CustomerRequestSerializer
      )
    render json: { requests: serialized_requests }, status: :ok
  end

  def set_request
    @request = Request.find_by(id: params[:id])

    # Return 404 if request is not found
    render json: { error: "Request not found" }, status: :not_found unless @request
  end

  def request_params
    params.require(:request).permit(
      :customer_id,
      :service_id,
      :packing_id,
      :foreman_id,
      :payments,
      :customer,
      :moving_date,
      :delivery_date_window_start,
      :delivery_date_window_end,
      :schedule_date_window_start,
      :schedule_date_window_end,
      :is_same_day_delivery,
      :is_delivery_now,
      :is_calculator_disabled,
      :status,
      :move_size_id,
      :start_time_window,
      :end_time_window,
      :start_time_window_delivery,
      :end_time_window_delivery,
      :start_time_window_schedule,
      :end_time_window_schedule,
      :crew_size,
      :crew_size_delivery,
      :rate,
      :sales_notes,
      :driver_notes,
      :customer_notes,
      :dispatch_notes,
      :deposit,
      :travel_time,
      :min_total_time,
      :can_edit_request,
      :paired_request_id,
      :paired_request,
      :is_moving_from_storage,
      work_time: %i[min max],
      total_time: %i[min max],
      total_price: %i[min max],
      details: %i[
        delicate_items_question_answer
        bulky_items_question_answer
        disassemble_items_question_answer
        comments
        is_touched
      ],
      origin: permit_nested_location_params_with_location,
      destination: permit_nested_location_params_with_location,
      mover_ids: [],
      truck_ids: [],
      stops: [ permit_nested_location_params_with_location ],
      extra_services: %i[quantity price name total],
    )
  end

  def permit_nested_location_params
    %i[street city state zip apt floor type]
  end

  def permit_nested_location_params_with_location
    permit_nested_location_params + [ location: %i[lat lng] ]
  end
end
