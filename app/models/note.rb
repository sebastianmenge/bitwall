class Note < ActiveRecord::Base
  belongs_to :wall

  def self.create_initial_personal(wall)
    wall.notes.create(body: "Hallo du", row: 1)
    wall.notes.create(body: "da", row: 2)
  end

  def self.create_initial_work(wall)
    wall.notes.create(body: "Hallo du", row: 1)
    wall.notes.create(body: "put your", row: 2)
    wall.notes.create(body: "workstuff here", row: 3)
  end

  def self.create_initial_vacation(wall)
    wall.notes.create(body: "Hallo du", row: 1)
    wall.notes.create(body: "hier kannst du dein urlaubszeug notieren", row: 2)
  end
end
