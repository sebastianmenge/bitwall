OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, CONFIG['facebook']['app_id'], CONFIG['facebook']['secret']
end
