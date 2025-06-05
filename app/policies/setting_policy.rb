class SettingPolicy < ApplicationPolicy
  attr_reader :user, :setting

  def initialize(user, setting)
    @user = user
    @setting = setting
  end

  def create?
    user.admin?
  end

  def bulk_update?
    user.admin?
  end
end
