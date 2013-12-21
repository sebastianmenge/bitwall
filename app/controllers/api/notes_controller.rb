module Api
  class NotesController < BaseController
    before_filter :set_note, only: [:update, :destroy]
    def index
      @notes = Note.all
      render json: @notes
    end

    def create
      @wall = Wall.find(params[:note][:wall_id])
      @note = @wall.notes.create(note_params)
      render json: @note
    end

    def update
      @note.update(note_params)
      render json: {status: "updated"}
    end

    def destroy
      @note.destroy
      render json: {status: "destroyed"}
    end

    def batch_destroy
      @wall = Wall.find(params[:wall_id])
      @wall.update(rows: params[:rows])
      Note.destroy_all({id: params[:ids]})

      render json: {status: "batch destroy executed"}
    end

    private
      def set_note
        @note = Note.find(params[:id])
      end

      def note_params
        params.require(:note).permit(:body, :color, :width, :row)
      end
  end
end
