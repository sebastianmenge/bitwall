class HomeController < ApplicationController
  before_filter :authorize, :only => [:wall]

  def redirect
    @wall_id = last_visited_or_first_wall.id
    render layout: false
  end

  def index
    if session[:user_id] && !oauth_token_expired?
      redirect_to wall_path(last_visited_or_first_wall)
    else
      render :index
    end
  end

  def wall
  end

  private
  def authorize
    if session[:user_id] && !oauth_token_expired?
      @wall_id = params[:id]
      render :app, layout: 'jsapp'
    else
      render :index
    end
  end

  def oauth_token_expired?
    Date.today > current_user.oauth_expires_at
  end

  def last_visited_or_first_wall
    current_user.walls.first
  end
end
