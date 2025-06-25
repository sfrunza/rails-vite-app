class UserSerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :role, :email_address, :phone, :additional_email, :additional_phone
end
