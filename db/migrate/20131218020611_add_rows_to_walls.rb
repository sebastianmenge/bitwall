class AddRowsToWalls < ActiveRecord::Migration
  def change
    add_column :walls, :rows, :string, array: true, default: '{}'
  end
end
