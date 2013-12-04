App.NoteView = Ember.View.extend
  classNames: ['note-element']
  attributeBindings: ['style']
  templateName: "notes/note"
  style: (->
    color = @get('color')
    width = @get('width')
    "background: #{color};width: #{width}%"
  ).property('width', 'color')
