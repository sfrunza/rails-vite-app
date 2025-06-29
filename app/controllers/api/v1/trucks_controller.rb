class Api::V1::TrucksController < ApplicationController
  include Pundit::Authorization
  before_action :set_truck, only: %i[destroy]

  CACHE_KEY = "trucks".freeze

  # GET /trucks
  def index
    @trucks = Rails.cache.fetch(CACHE_KEY, expires_in: 1.year) do
      Rails.logger.info "[CACHE] MISS: loading fresh trucks"
      Truck.select(:id, :name, :is_active).order(:id)
    end
    Rails.logger.info "[CACHE] HIT: returning cached trucks"
    render json: @trucks
  end

  # POST /trucks
  def create
    @truck = Truck.new(truck_params)
    authorize @truck
    if @truck.save
      Rails.cache.delete(CACHE_KEY)
      render json: @truck, status: :created
    else
      render json: @truck.errors, status: :unprocessable_entity
    end
  end

  # POST /trucks/bulk_update
  def bulk_update
    if params[:trucks].blank?
      return(
        render json: {
                 error: "Unprocessable entity"
               },
               status: :unprocessable_entity
      )
    end

    authorize Truck

    @trucks_params = params[:trucks]
    @trucks_params.each do |truck_params|
      truck = Truck.find(truck_params[:id])
      permitted_params =
        truck_params.except(:id, :created_at, :updated_at).permit(
          :name,
          :is_active
        )

      unless truck.update(permitted_params)
        render json: truck.errors, status: :unprocessable_entity
        return
      end
    end
    Rails.cache.delete(CACHE_KEY)
    render json: @trucks, status: :accepted
  end

  # DELETE /trucks/1
  def destroy
    authorize @truck
    @truck.destroy!
    Rails.cache.delete(CACHE_KEY)
  end

  private

  def set_truck
    @truck = Truck.find(params.expect(:id))
  end

  def truck_params
    params.expect(truck: %i[name is_active])
  end
end
