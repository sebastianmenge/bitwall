class CreateWalls < ActiveRecord::Migration
  def change
    create_table :walls do |t|
      t.string :name
      t.integer :rows
      t.integer :height_1
      t.integer :height_2
      t.integer :height_3
      t.integer :height_4

      t.timestamps
    end
  end
end
