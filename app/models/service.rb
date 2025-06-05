class Service < ApplicationRecord
  # Validations
  validates :name, presence: true, length: { minimum: 5, maximum: 255 }

  # Associations
  # has_many :requests

  # Callbacks
  acts_as_list column: :index, top_of_list: 0
end
