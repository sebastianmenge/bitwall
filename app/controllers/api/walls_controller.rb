module Api
  class WallsController < BaseController
    before_filter :set_wall, only: [:show, :destroy, :update]
    def index
      @walls = Wall.order('id ASC')
      render json: @walls
    end

    def show
      render json: @wall
    end

    def create
      @wall = Wall.create(wall_params)
      @wall.notes.create(row: 1)
      render json: @wall
    end

    def update
      @wall.update(wall_params)
      render json: {status: "updated"}
    end

    def destroy
      @wall.destroy
      render json: @wall
    end

    private
      def set_wall
        @wall = Wall.find(params[:id])
      end

      def wall_params
        params.require(:wall).permit(:name, {:rows => []}, :height_1, :height_2, :height_3, :height_4)
      end
  end
end
