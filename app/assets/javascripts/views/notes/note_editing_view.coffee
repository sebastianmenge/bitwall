App.NoteEditingView = Ember.TextArea.extend
  focusOut: ->
    @.$().prev('.display-area').show()
    value = @.$().val()
    @get('parentView.controller').update({body: value})

