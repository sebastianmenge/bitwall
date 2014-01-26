App.NoteDisplayView = Ember.View.extend
  attributeBindings: ['style']
  tagName: 'pre'
  click: ->
    @.$().hide()
    @.$().next('.editing-area').show().focus()




