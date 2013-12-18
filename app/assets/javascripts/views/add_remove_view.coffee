App.AddRemoveView = Ember.View.extend Ember.TargetActionSupport,
  tagName: 'button'
  click: ->
    action = @get('action')
    rowNumber = @get('row')
    ctrl = @get('controller.controllers.wall')
    @triggerAction
      action: action
      target: ctrl
      actionContext: rowNumber

  mouseEnter: ->
    if @get('action') == "deleteRow"
      $(".row-#{@get('row')}").addClass('highlight')

  mouseLeave: ->
    $(".row").removeClass('highlight')
