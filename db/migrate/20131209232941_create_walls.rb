class CreateWalls < ActiveRecord::Migration
  def change
    create_table :walls do |t|
      t.string :name
      t.text :rows, array: true, null: false, default: '{}'
      t.integer :height_1
      t.integer :height_2
      t.integer :height_3
      t.integer :height_4

      t.timestamps
    end
  end
end
