class RequestSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  include ActionView::Helpers::AssetUrlHelper

  attributes :id,
             :moving_date,
             :delivery_date_window_start,
             :delivery_date_window_end,
             :schedule_date_window_start,
             :schedule_date_window_end,
             :is_same_day_delivery,
             :is_delivery_now,
             :is_calculator_disabled,
             :status,
             :start_time_window,
             :end_time_window,
             :start_time_window_delivery,
             :end_time_window_delivery,
             :start_time_window_schedule,
             :end_time_window_schedule,
             :crew_size,
             :crew_size_delivery,
             :move_size_id,
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
             :work_time,
             :total_time,
             :total_price,
             :details,
             :origin,
             :destination,
             :stops,
             :booked_at,
             :created_at,
             :updated_at,
             :service_id,
             :packing_id,
             :truck_ids,
             :extra_services,
             :extra_services_total

  attribute :image_urls

  has_one :customer, serializer: UserSerializer
  # has_one :foreman, serializer: UserSerializer
  # has_many :movers, serializer: UserSerializer
  # has_many :request_extra_services, serializer: RequestExtraServiceSerializer

  # def extra_services_total
  #   object.extra_services_total
  # end

  def image_urls
    if object.images.attached?
      object.images.map do |image|
        {
          id: image.id,
          url: url_for(image),
          thumb: url_for(image.variant(resize_to_limit: [ 300, 300 ]))

        }
      end
    end
  end
end
