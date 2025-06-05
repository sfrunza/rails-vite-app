class ServicePolicy < ApplicationPolicy
  attr_reader :user, :service

  def initialize(user, service)
    @user = user
    @service = service
  end

  def create?
    user.admin?
  end

  def bulk_update?
    user.admin?
  end

  def destroy?
    user.admin?
  end
end
