class CreateNotes < ActiveRecord::Migration
  def change
    create_table :notes do |t|
      t.text :body
      t.string :color
      t.string :width
      t.integer :row
      t.references :wall, index: true

      t.timestamps
    end
  end
end
