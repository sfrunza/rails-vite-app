class ExtraServicePolicy < ApplicationPolicy
  attr_reader :user, :extra_service

  def initialize(user, extra_service)
    @user = user
    @extra_service = extra_service
  end

  def bulk_update?
    user.admin?
  end

  def create?
    user.admin?
  end

  def destroy?
    user.admin?
  end
end
