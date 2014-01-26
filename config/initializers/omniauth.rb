OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, '1399261643661685', 'aa152ed74ff5439ab256a1f46b8801e4'
end
