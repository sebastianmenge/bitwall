class HomeController < ApplicationController
  before_filter :authorize

  def index
  end

  def app
    render layout: "jsapp"
  end

  private
  def authorize
    if session[:user_id] && !oauth_token_expired?
      render :app, layout: "jsapp"
    else
      render :index
    end
  end

  def oauth_token_expired?
    Date.today > current_user.oauth_expires_at
  end
end
