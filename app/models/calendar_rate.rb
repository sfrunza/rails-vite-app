class CalendarRate < ApplicationRecord
  belongs_to :rate, optional: true

  def self.create_full_year
    default_rate = Rate.first
    (
      Date.today.beginning_of_month..11.months.from_now.end_of_month
    ).each do |date|
      find_or_create_by(date: date) do |setting|
        setting.enable_automation = false
        setting.enable_auto_booking = false
        setting.rate = default_rate
        setting.is_blocked = false
      end
    end
  end

  def self.create_for_same_month_next_year
    default_rate = Rate.first
    same_month_next_year = Date.today.next_year.beginning_of_month

    same_month_next_year.all_month.each do |date|
      find_or_create_by(date: date) do |setting|
        setting.enable_automation = false
        setting.enable_auto_booking = false
        setting.rate = default_rate
        setting.is_blocked = false
      end
    end
  end
end
