module Api
  class BaseController < ::ApplicationController
    respond_to :json
    before_filter :require_json_format
    protect_from_forgery except: [:routing_error]

    private

    def require_json_format
      unless request.format == "json"
        render json: {error: "Only json format is supported"}, status: :bad_request
        return false
      end
      true
    end
    private :require_json_format

    def routing_error
      render json: nil, status: 400
    end
    private :routing_error

    def respond_error(response, status = :unprocessable_entity)
      respond_invalid({errors: {key: response}}, status)
    end
    private :respond_error

    def respond_invalid(response, status = :unprocessable_entity)
      render json: response, status: status
    end
    private :respond_invalid

    def unauthorized
      respond_error('unauthorized')
    end
    private :unauthorized

    def account_doesnt_exist
      session.sign_out
      respond_error('sessionNoFBdata')
    end
    private :account_doesnt_exist

  end
end
