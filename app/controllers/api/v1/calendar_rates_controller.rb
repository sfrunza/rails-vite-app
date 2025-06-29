class Api::V1::CalendarRatesController < ApplicationController
  include Pundit::Authorization
  allow_unauthenticated_access only: %i[index]
  before_action :set_calendar_rate, only: %i[update destroy]

  CACHE_KEY = "calendar_rates".freeze

  # GET /calendar_rates
  def index
    calendar_rates = Rails.cache.fetch(CACHE_KEY, expires_in: 1.year) do
      Rails.logger.info "[CACHE] MISS: loading fresh calendar rates"
      CalendarRate
        .where(
          date: Date.today.beginning_of_month..11.months.from_now.end_of_month
        )
        .order(:date)
        .pluck(
          :id,
          :date,
          :rate_id,
          :enable_automation,
          :enable_auto_booking,
          :is_blocked
        )
      end
      Rails.logger.info "[CACHE] HIT: returning cached calendar rates"

    formatted_rates =
      calendar_rates.each_with_object({}) do |rate, hash|
        hash[rate[1].strftime("%Y-%m-%d")] = {
          id: rate[0],
          formatted_date: rate[1].strftime("%Y-%m-%d"),
          rate_id: rate[2],
          enable_automation: rate[3],
          enable_auto_booking: rate[4],
          is_blocked: rate[5]
        }
      end

    render json: formatted_rates
  end

  # POST /calendar_rates
  def create
    @calendar_rate = CalendarRate.new(calendar_rate_params)

    if @calendar_rate.save
      Rails.cache.delete(CACHE_KEY)
      render json: @calendar_rate, status: :created
    else
      render json: @calendar_rate.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /calendar_rates/1
  def update
    if @calendar_rate.update(calendar_rate_params)
      authorize @calendar_rate
      Rails.cache.delete(CACHE_KEY)
      render json: @calendar_rate
    else
      render json: @calendar_rate.errors, status: :unprocessable_entity
    end
  end

  # DELETE /calendar_rates/1
  def destroy
    @calendar_rate.destroy!
  end

  private

  def set_calendar_rate
    @calendar_rate = CalendarRate.find(params.expect(:id))
  end

  def calendar_rate_params
    params.expect(
      calendar_rate: %i[
        date
        enable_automation
        enable_auto_booking
        is_blocked
        rate_id
      ]
    )
  end
end
