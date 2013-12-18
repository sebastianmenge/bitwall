class ChangeRowsToArray < ActiveRecord::Migration
  def self.up
   change_column :walls, :rows, :string, array: true
  end

  def self.down
   change_column :walls, :rows, :integer
  end
end
