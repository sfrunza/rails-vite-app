class Api::V1::SearchController < ApplicationController
  # GET /search
  def index
    query = params[:query]
    if query.blank?
      render json: {
               error: "Query parameter is required"
             },
             status: :unprocessable_entity and return
    end

    normalized_query =
      ActiveRecord::Base.sanitize_sql_like(query.downcase.strip)

    requests =
      Request
        .joins(:customer)
        .select(
          "requests.id, requests.status, requests.customer_id, users.first_name, users.last_name, users.email_address, users.phone"
        )
        .where(sanitized_search_condition, query: "%#{normalized_query}%")
        .order(
          Arel.sql(
            "CASE WHEN requests.id::text = '#{normalized_query}' THEN 0 ELSE 1 END"
          )
        )
        .limit(20)
    render json: requests,
           each_serializer: RequestSearchSerializer,
           query: query
  end

  private

  def sanitized_search_condition
    @sanitized_search_condition ||= [
      "requests.id::text LIKE :query",
      "LOWER(users.first_name) LIKE :query",
      "LOWER(users.last_name) LIKE :query",
      "LOWER(users.email_address) LIKE :query",
      "LOWER(users.phone) LIKE :query"
    ].join(" OR ")
  end
end
