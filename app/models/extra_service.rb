class ExtraService < ApplicationRecord
  # Validations
  validates :name, presence: true
  validates :price,
            numericality: {
              greater_than_or_equal_to: 0,
              less_than: 2_147_483_647
            }

  # Callbacks
  acts_as_list column: :index, top_of_list: 0
end
