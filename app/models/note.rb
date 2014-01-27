class Note < ActiveRecord::Base
  belongs_to :wall

  def self.create_initial_personal(wall)
    wall.notes.create(body: "On the left you can switch between your walls and add or remove rows.", row: 1)
    wall.notes.create(body: "On the right you can add a new note for a row.", row: 1)
    wall.notes.create(body: "To delete a note look into the bottom right corner of a note.", row: 2)
  end

  def self.create_initial_work(wall)
    wall.notes.create(body: "Write down your notes here...", row: 1)
    wall.notes.create(body: "or here...", row: 1)
    wall.notes.create(body: "or here", row: 1)
  end
end
