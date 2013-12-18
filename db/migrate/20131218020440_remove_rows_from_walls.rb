class RemoveRowsFromWalls < ActiveRecord::Migration
  def change
    remove_column :walls, :rows, :string
  end
end
