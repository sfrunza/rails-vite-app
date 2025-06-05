class Api::V1::RatesController < ApplicationController
  include Pundit::Authorization

  # GET /rates
  def index
    rates =
      Rate.select(
        :id,
        :name,
        :extra_mover_rate,
        :extra_truck_rate,
        :enable,
        :color,
        :movers_rates
      ).order(:id)
    render json: rates
  end

  # POST /rates
  def create
    @rate = Rate.new(rate_params)
    authorize @rate
    if @rate.save
      render json: @rate, status: :created
    else
      render json: @rate.errors.full_messages, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /rates/bulk_update
  def bulk_update
    if params[:rates].blank?
      return(
        render json: {
                 error: "Rates parameter is required"
               },
               status: :unprocessable_entity
      )
    end

    authorize Rate

    @rates = params[:rates]
    @rates.each do |rate_params|
      rate = Rate.find(rate_params[:id])
      permitted_params =
        rate_params.except(:id, :created_at, :updated_at).permit(
          :extra_mover_rate,
          :extra_truck_rate,
          :enable,
          :name,
          :color,
          movers_rates: %i[hourly_rate]
        )

      unless rate.update(permitted_params)
        render json: rate.errors, status: :unprocessable_entity
        return
      end
    end
    render json: @rates, status: :accepted
  end

  private

  def rate_params
    params.expect(
      rate: %i[extra_mover_rate extra_truck_rate enable name color movers_rates]
    )
  end

  # def permit_nested_movers_rates_params
  #   %i[hourly_rate]
  # end
end
