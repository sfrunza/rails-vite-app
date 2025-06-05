class PasswordsMailer < ApplicationMailer
  def reset(user)
    @user = user
    @reset_url =
      "#{Rails.application.credentials.dig(:domain)}/auth/reset-password?token=#{user.password_reset_token}"
    mail subject: "Reset your password", to: user.email_address
  end
end
