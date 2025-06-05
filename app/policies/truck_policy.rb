class TruckPolicy < ApplicationPolicy
  attr_reader :user, :truck

  def initialize(user, truck)
    @user = user
    @truck = truck
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
