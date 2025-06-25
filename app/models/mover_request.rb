class MoverRequest < ApplicationRecord
  # Associations
  belongs_to :user, optional: true
  belongs_to :request, optional: true


  # Validations
  validates :user_id, uniqueness: { scope: :request_id }
  validate :ensure_valid_mover_role

  private

  def ensure_valid_mover_role
    valid_roles = %w[helper driver foreman]
    unless valid_roles.include?(user&.role)
      errors.add(:user, "must have a role of helper, driver, or foreman")
    end
  end
end
