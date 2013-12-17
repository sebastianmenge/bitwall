App.AddRemoveView = Ember.View.extend Ember.TargetActionSupport,
  click: ->
    action = @get('action')
    ctrl = @get('controller.controllers.wall')
    @triggerAction
      action: action
      target: ctrl

