App.CreateNoteView = Ember.View.extend
  tagName: 'button'
  click: ->
    ctrl = @get('parentView.controller')
    row = @.$().parents('.row').data('row')
    ctrl.send('createNote', row)
