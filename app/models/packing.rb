class Packing < ApplicationRecord
  # Validations
  validates :name, presence: true
  validates :labor_increase,
            numericality: {
              greater_than_or_equal_to: 0,
              less_than_or_equal_to: 100
            }

  # Associations
  has_many :requests, dependent: :restrict_with_error

  # Callbacks
  acts_as_list column: :index, top_of_list: 0
end
