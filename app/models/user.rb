class User < ApplicationRecord
  has_secure_password
  enum :role, { customer: 0, helper: 1, driver: 2, foreman: 3, manager: 4, admin: 5 }, default: :customer

  # Associations
  has_many :sessions, dependent: :destroy
  has_many :posts, dependent: :destroy

  # Validations
  normalizes :email_address, with: ->(e) { e.strip.downcase }
  normalizes :additional_email, with: ->(e) { e.strip.downcase }

  validates :email_address, presence: true, uniqueness: true
  validates :email_address, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password,
            length: {
              minimum: 6
            },
            if: -> { new_record? || !password.nil? }

  # Scopes
  scope :active, -> { where(active: true) }
end
