class Wall < ActiveRecord::Base
  belongs_to :user
  has_many :notes, dependent: :destroy, order: 'id ASC'

  def self.create_initial(user)
    personal = user.walls.create(name: "Personal", rows: [1, 2])
    work = user.walls.create(name: "Work", rows: [1])

    Note.create_initial_personal(personal)
    Note.create_initial_work(work)
  end
end
