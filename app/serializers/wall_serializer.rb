class WallSerializer < ActiveModel::Serializer
  attributes :id, :name, :rows, :height_1, :height_2, :height_3, :height_4
  has_many :notes
end
