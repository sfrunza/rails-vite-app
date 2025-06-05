class RatePolicy < ApplicationPolicy
  attr_reader :user, :rate

  def initialize(user, rate)
    @user = user
    @rate = rate
  end

  def bulk_update?
    user.admin?
  end
end
