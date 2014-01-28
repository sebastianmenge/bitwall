class RemoveColorFromNotes < ActiveRecord::Migration
  def change
    remove_column :notes, :color, :string
  end
end
