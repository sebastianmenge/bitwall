App.NoteEditingView = Ember.TextArea.extend
  focusIn: ->
    @get('parentView').toggleSettings('Out')

  focusOut: ->
    @.$().hide()
    @.$().prev('.display-area').show()
    @triggerUpdate()

  triggerUpdate: ->
    @triggerAction
      action: 'update'
      target: @get('parentView.controller')
