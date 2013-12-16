module Api
  class WallsController < BaseController
    def index
      @walls = Wall.all
      render json: @walls
    end

    def show
      @wall = Wall.find(params[:id])
      render json: @wall
    end

    private
      def set_banner
        @wall = Wall.find(params[:id])
      end

      def wall_params
        params.require(:wall).permit(:name, :rows, :height_1, :height_2, :height_3, :height_4)
      end
  end
end
