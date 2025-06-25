class Api::V1::UsersController < ApplicationController
  before_action :set_user, only: %i[show]

  def index
    @users = User.all
    render json: @users.as_json(except: :password_digest)
  end

  def show
    @user = User.find(params[:id])
    render json: @user.as_json(except: :password_digest)
  end

  def check_email
    @user = User.find_by(email_address: params[:email_address])
    render json: @user.as_json(except: :password_digest), status: :ok
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user.as_json(except: :password_digest), status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update
    @user = User.find(params[:id])
    if @user.update(user_params)
      render json: @user.as_json(except: %i[password_digest])
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @user = User.find(params[:id])
    @user.destroy
    head :no_content
  end

  private

  def set_user
    @user = Current.user
  end

  def user_params
    params.expect(
      user: %i[first_name last_name email_address additional_email phone additional_phone role active]
    )
  end
end
