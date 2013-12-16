class NoteSerializer < ActiveModel::Serializer
  attributes :id, :body, :color, :width, :row
end
