class Api::V1::PackingsController < ApplicationController
  include Pundit::Authorization
  before_action :set_packing, only: %i[update destroy]

  # GET /packings
  def index
    packings =
      Packing.select(
        :id,
        :name,
        :description,
        :is_default,
        :labor_increase,
        :index
      ).order(:index)

    render json: packings, status: :ok
  end

  # POST /packings
  def create
    @packing = Packing.new(packing_params)
    authorize @packing
    if @packing.save
      render json: @packing, status: :created
    else
      render json: @packing.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /packings/1
  def update
    if @packing.update(packing_params)
      authorize @packing
      render json: @packing
    else
      render json: @packing.errors, status: :unprocessable_entity
    end
  end

  # POST /packings/bulk_update
  def bulk_update
    if params[:packings].blank?
      return(
        render json: {
                 error: "Unprocessable entity"
               },
               status: :unprocessable_entity
      )
    end

    authorize Packing

    @packings_params = params[:packings]
    @packings_params.each do |packing_params|
      packing = Packing.find(packing_params[:id])
      permitted_params =
        packing_params.except(:id, :created_at, :updated_at).permit(:index)
      unless packing.update(permitted_params)
        render json: packing.errors, status: :unprocessable_entity
        return
      end
    end
    render json: @packings, status: :accepted
  end

  # DELETE /packings/1
  def destroy
    authorize @packing
    @packing.destroy!
  end

  private

  def set_packing
    @packing = Packing.find(params.expect(:id))
  end

  def packing_params
    params.expect(packing: %i[name description is_default labor_increase index])
  end
end
