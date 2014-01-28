module Api
  class WallsController < BaseController
    before_filter :set_wall, only: [:show, :destroy, :update]
    def index
      @walls = current_user.walls.order('id ASC')
      render json: @walls
    end

    def show
      render json: @wall
    end

    def create
      @wall = current_user.walls.create(wall_params)
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
        @wall = current_user.walls.find(params[:id])
      end

      def wall_params
        params.require(:wall).permit(:name, {:rows => []})
      end
  end
end
