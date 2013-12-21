App.NoteEditingView = Ember.TextArea.extend
  focusIn: ->
    @get('parentView').toggleSettings('Out')

  focusOut: ->
    @.$().hide()
    @.$().prev('.display-area').show()
    @get('parentView.controller').send('update')
