class UserPolicy < ApplicationPolicy
  attr_reader :user, :employee

  def initialize(user, employee)
    @user = user
    @employee = employee
  end

  def create?
    user.admin?
  end

  def update?
    user.admin?
  end
end
