class Wall < ActiveRecord::Base
  has_many :notes, dependent: :destroy, order: 'id ASC'
end
