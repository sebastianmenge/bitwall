class RemoveHeight1FromWalls < ActiveRecord::Migration
  def change
    remove_column :walls, :height_1, :integer
    remove_column :walls, :height_2, :integer
    remove_column :walls, :height_3, :integer
    remove_column :walls, :height_4, :integer
  end
end
