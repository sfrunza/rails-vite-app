# RailsSettings Model
class Setting < RailsSettings::Base
  cache_prefix { "v1" }

  has_one_attached :company_logo
  # Define fields
  field :company_name, type: :string
  field :company_address, type: :string
  field :company_phone, type: :string
  field :company_email, type: :string
  field :company_website, type: :string
  # Define your fields
  # field :host, type: :string, default: "http://localhost:3000"
  # field :default_locale, default: "en", type: :string
  # field :confirmable_enable, default: "0", type: :boolean
  # field :admin_emails, default: "admin@rubyonrails.org", type: :array
  # field :omniauth_google_client_id, default: (ENV["OMNIAUTH_GOOGLE_CLIENT_ID"] || ""), type: :string, readonly: true
  # field :omniauth_google_client_secret, default: (ENV["OMNIAUTH_GOOGLE_CLIENT_SECRET"] || ""), type: :string, readonly: true

  def self.instance
    first_or_create!
  end

  def self.company_logo_url
    company_logo.attached? ? url_for(company_logo) : nil
  end
end
