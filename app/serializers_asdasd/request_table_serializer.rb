class RequestTableSerializer < ActiveModel::Serializer
  attributes :id,
             :moving_date,
             :service_id,
             :status,
             :customer,
             :created_at,
             :updated_at,
             :total_price,
             :move_size_id,
             :crew_size,
             :is_moving_from_storage,
             :has_paired_request,
             :origin,
             :destination

  def origin
    {
      city: object.origin["city"],
      state: object.origin["state"],
      zip: object.origin["zip"]
    }
  end

  def destination
    {
      city: object.destination["city"],
      state: object.destination["state"],
      zip: object.destination["zip"]
    }
  end

  def has_paired_request
    object.paired_request.present?
  end

  def customer
    if object.customer_id
      {
        first_name: object.customer.first_name,
        last_name: object.customer.last_name,
        phone: object.customer.phone
      }
    else
      nil
    end
  end
end
