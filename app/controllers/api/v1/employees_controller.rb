class Api::V1::EmployeesController < ApplicationController
  include Pundit::Authorization

  before_action :set_employee, only: %i[show update]

  def index
    active = params[:active]
    employees =
      User
        .where.not(role: :customer)
        .order(active: :desc, id: :asc)
        .pluck(
          :id,
          :first_name,
          :last_name,
          :role,
          :phone,
          :email_address,
          :active
        )
    if active.present?
      employees =
        User
          .where.not(role: :customer)
          .where(active: true)
          .order(:id)
          .pluck(
            :id,
            :first_name,
            :last_name,
            :role,
            :phone,
            :email_address,
            :active
          )
    end

    serialized_employees =
      employees.map do |employee_array|
        {
          id: employee_array[0],
          first_name: employee_array[1],
          last_name: employee_array[2],
          role: employee_array[3],
          phone: employee_array[4],
          email_address: employee_array[5],
          active: employee_array[6]
        }
      end
    render json: serialized_employees
  end

  def show
    render json: @employee.as_json(except: %i[password_digest])
  end

  def create
    @employee = User.create(employee_params)
    authorize @employee
    if @employee.save
      render json: @employee, status: :created
    else
      render json: @employee.errors, status: :unprocessable_entity
    end
  end

  def update
    authorize @employee
    if @employee.update(employee_params)
      render json: @employee.as_json(except: %i[password_digest])
    else
      render json: @employee.errors, status: :unprocessable_entity
    end
  end

  private

  def set_employee
    @employee = User.find(params[:id])
  end

  def employee_params
    params.expect(
      employee: %i[
        first_name
        last_name
        email_address
        phone
        role
        active
        password
      ]
    )
  end
end
