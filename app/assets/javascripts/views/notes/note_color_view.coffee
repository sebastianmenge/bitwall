App.NoteColorView = Ember.View.extend Ember.TargetActionSupport,
  tagName: 'button'
  attributeBindings: ['style']
  classNames: ['select-note-color']
  style: (->
    "background: #{@get('color')}"
  ).property('style', 'color')
  click: ->
    @triggerAction
      action: 'update'
      target: @get('controller')
      actionContext: {color: @get('color')}
