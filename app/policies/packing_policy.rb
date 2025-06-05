class PackingPolicy < ApplicationPolicy
  attr_reader :user, :packing

  def initialize(user, packing)
    @user = user
    @packing = packing
  end

  def bulk_update?
    user.admin?
  end

  def create?
    user.admin?
  end

  def update?
    user.admin?
  end

  def destroy?
    user.admin?
  end
end
