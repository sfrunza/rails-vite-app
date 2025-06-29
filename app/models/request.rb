class Request < ApplicationRecord
  enum :status,
       %i[
         pending
         pending_info
         pending_date
         hold
         not_confirmed
         confirmed
         not_available
         completed
         spam
         canceled
         refused
         closed
         expired
         archived
       ]

  belongs_to :customer,
             class_name: "User",
             foreign_key: "customer_id",
             optional: true
  belongs_to :foreman,
             class_name: "User",
             foreign_key: "foreman_id",
             optional: true
  has_many :mover_requests
  has_many :movers, through: :mover_requests, source: :user
  has_many_attached :images
  has_and_belongs_to_many :trucks
  belongs_to :service
  belongs_to :packing
  belongs_to :move_size, optional: true
  belongs_to :paired_request, class_name: "Request", optional: true
  # has_one :contract, dependent: :destroy
  # has_many :payments, as: :entity, class_name: "Payment"
  # has_many :messages, dependent: :destroy
  # has_many :request_extra_services, dependent: :destroy
  # has_many :extra_services, through: :request_extra_services

  before_save :calculate_total_time
  before_save :calculate_total_price
  before_save :update_can_edit_request
  before_save :check_if_details_touched
  before_save :calculate_extra_services_total,
              if: :will_save_change_to_extra_services?

  after_create_commit -> { broadcast(:create) }
  after_update_commit -> { broadcast(:update) }
  # validates :service, presence: true
  # validates :packing, presence: true
  # validates :moving_date, presence: true
  # validates :status, presence: true
  # validates :size, presence: true
  # validates :crew_size, presence: true
  # validates :rate, presence: true
  #
  #
  # after_create_commit { broadcast_request }

  validate :validate_extra_services

  public

  def pair_with(other_request)
    self.update!(paired_request: other_request, is_moving_from_storage: false)
    other_request.update!(
      paired_request: self,
      is_moving_from_storage: true,
      service: Service.find_by(name: "Moving & Storage")
    )
  end

  def extra_services_items
    (extra_services || []).map do |item|
      Types::ExtraServiceItem.from_hash(item)
    end
  end

  def extra_services_items=(items)
    cleaned =
      items.map do |item|
        esi =
          item.is_a?(ExtraServiceItem) ? item : ExtraServiceItem.from_hash(item)
        esi.recalculate_total!
        esi.to_h
      end
    self.extra_services = cleaned
  end

  def extra_services_total
    extra_services_items.sum(&:total)
  end

  private

  def broadcast(event)
    serialized_request = RequestSerializer.new(self)
    ActionCable.server.broadcast("request_#{id}", serialized_request.as_json)

    table_requests = ApplicationController.renderer.render(
      template: "api/v1/requests/table",
      formats: [ :json ],
      assigns: { request: self }
    )

    ActionCable.server.broadcast("requests", JSON.parse(table_requests))
  end

  def check_if_details_touched
    return unless details.is_a?(Hash)
    self.details["is_touched"] = details.values.any? do |value|
      value.is_a?(String) && !value.strip.empty?
    end
  end

  def update_can_edit_request
    allowed_statuses = %w[pending pending_info pending_date hold not_confirmed]
    self.can_edit_request = allowed_statuses.include?(status)
  end

  def calculate_total_time
    min_total_time = self.min_total_time.to_i
    travel_time_minutes = travel_time.to_i
    work_time_min_minutes = work_time["min"].to_i
    work_time_max_minutes = work_time["max"].to_i

    # Calculate total time in minutes
    total_minutes_min = [
      min_total_time,
      travel_time_minutes + work_time_min_minutes
    ].max
    total_minutes_max = travel_time_minutes + work_time_max_minutes

    total_minutes_max = 0 if total_minutes_max <= min_total_time

    self.total_time = { min: total_minutes_min, max: total_minutes_max }
  end

  def calculate_total_price
    base_price = calculate_base_price
    extras = extra_services_total

    min_price = base_price[:min] + extras
    max_price = base_price[:max] + extras

    self.total_price = { min: min_price, max: max_price }
  end

  def calculate_base_price
    if self.service.name == "Flat Rate"
      # For requests with a Flat Price type, set total_price directly to the rate
      { min: rate || 0, max: rate || 0 }
    elsif total_time.present? && total_time.is_a?(Hash) && rate.present?
      # Convert total_time from minutes to hours (divide by 60)
      total_time_hours_min = total_time["min"] / 60.0
      total_time_hours_max = total_time["max"] / 60.0

      # Calculate total_price based on total_time in hours and rate per hour
      min_price = total_time_hours_min * rate
      max_price = total_time_hours_max * rate

      { min: min_price, max: max_price }
    else
      # Default to zero price if total_time or rate is missing or invalid
      { min: 0, max: 0 }
    end
  end

  def validate_extra_services
    extra_services_items.each_with_index do |item, i|
      if item.quantity.to_i <= 0
        errors.add(
          :extra_services,
          "Quantity must be greater than 0 for service '#{item.name}'"
        )
      elsif !item.valid?
        errors.add(:extra_services, item.errors.full_messages)
      end
    end
  end

  def calculate_extra_services_total
    self.extra_services_total = extra_services.sum { |item| item["total"].to_i }
  end

  # private

  # def broadcast_request
  #   ActionCable.server.broadcast("request_#{id}", self)
  # end
end
