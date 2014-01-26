class Wall < ActiveRecord::Base
  belongs_to :user
  has_many :notes, dependent: :destroy, order: 'id ASC'
end
