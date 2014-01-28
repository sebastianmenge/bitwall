class RemoveWidthFromNotes < ActiveRecord::Migration
  def change
    remove_column :notes, :width, :string
  end
end
