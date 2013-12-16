App.CreateNoteView = Ember.View.extend Ember.TargetActionSupport,
  tagName: 'button'
  click: ->
    ctrl = @get('parentView.controller')
    row = @.$().parents('.row').data('row')
    @triggerAction
      action: 'createNote'
      target: ctrl
      actionContext: row
