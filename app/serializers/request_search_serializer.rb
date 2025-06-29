class RequestSearchSerializer < ActiveModel::Serializer
  attributes :data, :highlighting

  def data
    # full_origin = "#{object.origin['city']} #{object.origin['state']} #{object.origin['zip']}"
    # full_destination = "#{object.destination['city']} #{object.destination['state']} #{object.destination['zip']}"

    {
      id: object.id,
      email_address: object.customer.email_address,
      phone: object.customer.phone,
      # origin: full_origin,
      # destination: full_destination,
      name: "#{object.customer.first_name} #{object.customer.last_name}",
      status: object.status.humanize.titleize
    }
  end

  # Define the `highlighting` attribute logic
  def highlighting
    query = instance_options[:query]
    user = object.customer
    # origin = object.origin
    # destination = object.destination

    full_name = "#{user.first_name} #{user.last_name}"
    # full_origin = "#{origin['city']} #{origin['state']} #{origin['zip']}"
    # full_destination = "#{destination['city']} #{destination['state']} #{destination['zip']}"
    highlights = {}

    highlights[:email_address] = highlight_query(
      user.email_address,
      query
    ) if user.email_address&.downcase&.include?(query.downcase)
    highlights[:phone] = highlight_query(user.phone, query) if user
      .phone
      &.downcase
      &.include?(query.downcase)
    highlights[:id] = highlight_query(object.id.to_s, query) if object
      .id
      .to_s
      .include?(query)
    highlights[:name] = highlight_query(
      full_name,
      query
    ) if full_name.downcase.include?(query.downcase)
    # highlights[:origin] = highlight_query(full_origin, query) if full_origin.downcase.include?(query.downcase)
    # highlights[:destination] = highlight_query(full_destination, query) if full_destination.downcase.include?(query.downcase)

    highlights.compact
  end

  private

  # Helper method to add highlighting to the query matches
  def highlight_query(text, query)
    text.gsub(/(#{Regexp.escape(query)})/i, '<mark>\1</mark>')
  end
end
