json.array! @requests do |request|
  json.id request.id
  json.moving_date request.moving_date
  json.service_id request.service_id
  json.status request.status
  json.created_at request.created_at
  json.booked_at request.booked_at
  json.total_price request.total_price
  json.move_size_id request.move_size_id
  json.crew_size request.crew_size
  json.is_moving_from_storage request.is_moving_from_storage
  json.has_paired_request request.paired_request.present?

  json.origin do
    json.city request.origin["city"]
    json.state request.origin["state"]
    json.zip request.origin["zip"]
  end

  json.destination do
    json.city request.destination["city"]
    json.state request.destination["state"]
    json.zip request.destination["zip"]
  end

  if request.customer_id
    json.customer do
      json.first_name request.customer.first_name
      json.last_name request.customer.last_name
      json.phone request.customer.phone
    end
  else
    json.customer nil
  end
end
