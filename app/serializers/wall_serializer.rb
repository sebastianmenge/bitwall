class WallSerializer < ActiveModel::Serializer
  attributes :id, :name, :rows
  has_many :notes
end
