class Api::V1::EntranceTypesController < ApplicationController
  include Pundit::Authorization
  allow_unauthenticated_access only: %i[index]
  before_action :set_entrance_type, only: %i[destroy]

  # GET /entrance_types
  def index
    @entrance_types = EntranceType.order(:index)

    render json: @entrance_types.as_json(only: %i[id name form_name index])
  end

  # POST /entrance_types
  def create
    @entrance_type = EntranceType.new(entrance_type_params)
    authorize @entrance_type

    if @entrance_type.save
      render json: @entrance_type, status: :created
    else
      render json: @entrance_type.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /entrance_types/bulk_update
  def bulk_update
    if params[:entrance_types].blank?
      return(
        render json: {
                 error: "Unprocessable entity"
               },
               status: :unprocessable_entity
      )
    end

    authorize EntranceType

    @entrance_types = params[:entrance_types]
    @entrance_types.each do |entrance_type|
      s = EntranceType.find(entrance_type[:id])
      s.update(
        entrance_type.except(:id, :created_at, :updated_at).permit(
          :index,
          :name,
          :form_name
        )
      )
    end
    render json: @entrance_types, status: :accepted
  end

  # DELETE /services/1
  def destroy
    authorize @entrance_type
    @entrance_type.destroy!
  end

  private

  def set_entrance_type
    @entrance_type = EntranceType.find(params.expect(:id))
  end

  def entrance_type_params
    params.expect(entrance_type: %i[name form_name index])
  end
end
