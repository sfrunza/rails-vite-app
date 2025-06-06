class GlobalSetting < ApplicationRecord
  has_one_attached :company_logo

  def self.instance
    first_or_create
  end
end
