class EntranceType < ApplicationRecord
  # Validations
  validates :name, :form_name, presence: true

  # Callbacks
  acts_as_list column: :index, top_of_list: 0
end
