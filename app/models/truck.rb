class Truck < ApplicationRecord
  # Validations
  validates :name, presence: true, length: { minimum: 1, maximum: 20 }

  # Associations
  has_and_belongs_to_many :requests, dependent: :nullify
end
