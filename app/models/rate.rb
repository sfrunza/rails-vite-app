class Rate < ApplicationRecord
  # Validations
  validates :name, presence: true

  # Associations
  has_many :calendar_rates

  # Callbacks
  after_update_commit :update_calendar_rates
  before_update :prevent_disable_first_rate

  def update_calendar_rates
    unless self.enable
      calendar_rates.each do |calendar_rate|
        calendar_rate.update(rate: Rate.first)
      end
    end
  end

  def prevent_disable_first_rate
    if self.enable == false && self.name == "Discount"
      errors.add(:rate, "Cannot disable the Discount rate")
      throw :abort
    end
  end
end
