require "digest/md5"

class MoveSize < ApplicationRecord
  # Validations
  validates :name, presence: true

  # Associations
  has_one_attached :image
  has_many :requests, dependent: :nullify

  # Callbacks
  acts_as_list column: :index, top_of_list: 0
  before_save :custom_active_storage_path

  def custom_active_storage_path
    if image.attached? && image.blob.new_record?
      image.blob.update(key: custom_path)
    end
  end

  private

  def custom_path
    extension = image.blob.filename.extension_with_delimiter
    timestamp = Time.now.to_i.to_s
    unique_hash = Digest::MD5.hexdigest(timestamp)
    "#{self.class.to_s.underscore}/#{id}/#{unique_hash}#{extension}"
  end
end
