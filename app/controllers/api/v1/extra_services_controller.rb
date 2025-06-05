class Api::V1::ExtraServicesController < ApplicationController
  include Pundit::Authorization
  before_action :set_extra_service, only: %i[destroy]

  # GET /extra_services
  def index
    @extra_services =
      ExtraService.select(:id, :name, :price, :enabled, :index).order(:index)

    render json: @extra_services, status: :ok
  end

  # POST /extra_services
  def create
    @extra_service = ExtraService.new(extra_service_params)
    authorize @extra_service
    if @extra_service.save
      render json: @extra_service, status: :created
    else
      render json: @extra_service.errors, status: :unprocessable_entity
    end
  end

  # POST /extra_services/bulk_update
  def bulk_update
    if params[:extra_services].blank?
      render json: {
               error: "Unprocessable entity"
             },
             status: :unprocessable_entity
    end

    authorize ExtraService

    @extra_services_params = params[:extra_services]

    @extra_services_params.each do |extra_service_params|
      extra_service = ExtraService.find(extra_service_params[:id])
      permitted_params =
        extra_service_params.except(:id, :created_at, :updated_at).permit(
          :name,
          :price,
          :enabled,
          :index
        )

      unless extra_service.update(permitted_params)
        render json: extra_service.errors, status: :unprocessable_entity
        return
      end
    end
    render json: @extra_services, status: :accepted
  end

  # DELETE /extra_services/1
  def destroy
    authorize @extra_service
    @extra_service.destroy!
  end

  private

  def set_extra_service
    @extra_service = ExtraService.find(params.expect(:id))
  end

  def extra_service_params
    params.expect(extra_service: %i[name price enabled index])
  end
end
