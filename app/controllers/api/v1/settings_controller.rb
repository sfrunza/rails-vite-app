class Api::V1::SettingsController < ApplicationController
  include Pundit::Authorization
  allow_unauthenticated_access only: %i[index]

  def index
    global_setting = GlobalSetting.instance
    render json: {
             company_name: Setting.company_name,
             company_address: Setting.company_address,
             company_phone: Setting.company_phone,
             company_email: Setting.company_email,
             company_website: Setting.company_website,
             company_logo:
               (
                 if global_setting.company_logo.attached?
                   url_for(global_setting.company_logo)
                 else
                   nil
                 end
               )
           }
  end

  def create
    @errors = ActiveModel::Errors.new

    authorize Setting, :create?

    # Validate all settings first
    setting_params.keys.each do |key|
      next if setting_params[key].nil?

      setting = Setting.new(var: key)
      setting.value = setting_params[key].strip
      @errors.merge!(setting.errors) unless setting.valid?
    end

    if @errors.any?
      render json: {
               errors: @errors.full_messages
             },
             status: :unprocessable_entity
      return
    end

    # Save all settings if validation passed
    setting_params.keys.each do |key|
      unless setting_params[key].nil?
        Setting.send("#{key}=", setting_params[key].strip)
      end
    end

    render json: { message: "Settings updated successfully" }, status: :ok
  end

  def bulk_update
    global_setting = GlobalSetting.instance

    authorize Setting, :bulk_update?

    # Update simple settings
    if params[:setting]
      params[:setting].each do |key, value|
        next if key == "company_logo" # Skip the logo to process it separately
        Setting.send("#{key}=", value)
      end
    end

    # Update the company_logo
    if params[:setting][:company_logo]
      global_setting.company_logo.attach(params[:setting][:company_logo])
    end

    if global_setting.save
      render json: {
               company_name: Setting.company_name,
               company_address: Setting.company_address,
               company_phone: Setting.company_phone,
               company_email: Setting.company_email,
               company_website: Setting.company_website,
               company_logo:
                 (
                   if global_setting.company_logo.attached?
                     url_for(global_setting.company_logo)
                   else
                     nil
                   end
                 )
             },
             status: :ok
    else
      render json: {
               errors: global_setting.errors.full_messages
             },
             status: :unprocessable_entity
    end
  end

  private

  def setting_params
    params.expect(:setting).permit(
      :company_name,
      :company_address,
      :company_phone,
      :company_email,
      :company_website,
      :company_logo
    )
  end
end
