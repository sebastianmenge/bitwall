App.NoteDisplayView = Ember.View.extend
  attributeBindings: ['style']
  tagName: 'pre'
  style: (->
    color = @get("parentView.color")
    "background: #{color};"
  ).property('style', 'color')

  click: ->
    @.$().hide()
    @.$().next('.editing-area').focus()




