class Api::V1::MoveSizesController < ApplicationController
  include Pundit::Authorization
  allow_unauthenticated_access only: %i[index]
  before_action :set_move_size, only: %i[update destroy]

  # GET /move_sizes
  def index
    move_sizes = MoveSize.with_attached_image.order(:index)

    render json: move_sizes.map { |move_size| move_size_data(move_size) }
  end

  # POST /move_sizes
  def create
    # @move_size = MoveSize.new(move_size_params)
    # authorize @move_size
    # if @move_size.save
    #   render json: @move_size, status: :created
    # else
    #   render json: @move_size.errors, status: :unprocessable_entity
    # end

    @move_size = MoveSize.new(move_size_params.except(:image))
    authorize @move_size

    if params[:move_size][:image].present?
      @move_size.image.attach(params[:move_size][:image])
    end

    if @move_size.save
      render json: move_size_data(@move_size), status: :created
    else
      render json: @move_size.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /move_sizes/1
  def update
    puts "Received Params: #{params.inspect}" # Debugging params
    # if @move_size.update(move_size_params)
    #   authorize @move_size
    #   render json: @move_size
    # else
    #   render json: @move_size.errors, status: :unprocessable_entity
    # end

    if @move_size.update(move_size_params.except(:image))
      authorize @move_size
      if params[:move_size][:image].present?
        @move_size.image.attach(params[:move_size][:image])
      end

      render json: move_size_data(@move_size), status: :ok
    else
      render json: @move_size.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /move_sizes/bulk_update
  def bulk_update
    if params[:move_sizes].blank?
      return(
        render json: {
                 error: "Unprocessable entity"
               },
               status: :unprocessable_entity
      )
    end

    authorize MoveSize

    @move_sizes = params[:move_sizes]
    @move_sizes.each do |move_size|
      s = MoveSize.find(move_size[:id])
      s.update(move_size.except(:id).permit(:index))
    end
    render json: @move_sizes, status: :accepted
  end

  # DELETE /services/1
  def destroy
    authorize @move_size
    @move_size.destroy!
  end

  private

  def set_move_size
    @move_size = MoveSize.find(params.expect(:id))
  end

  def move_size_params
    params
      .expect(
        move_size: [
          :name,
          :description,
          :index,
          :dispersion,
          :truck_count,
          :weight,
          :volume,
          :image,
          volume_with_dispersion: %i[min max],
          crew_size_settings: []
        ]
      )
      .tap do |whitelisted|
        if params[:move_size][:crew_size_settings].is_a?(String)
          begin
            whitelisted[:crew_size_settings] = JSON.parse(
              params[:move_size][:crew_size_settings]
            )
          rescue JSON::ParserError
            whitelisted[:crew_size_settings] = []
          end
        end
      end
  end

  def move_size_data(move_size)
    {
      id: move_size.id,
      name: move_size.name,
      description: move_size.description,
      index: move_size.index,
      dispersion: move_size.dispersion,
      truck_count: move_size.truck_count,
      weight: move_size.weight,
      volume: move_size.volume,
      volume_with_dispersion: move_size.volume_with_dispersion,
      crew_size_settings: move_size.crew_size_settings,
      image_url: move_size.image.attached? ? url_for(move_size.image) : nil
    }
  end
end
