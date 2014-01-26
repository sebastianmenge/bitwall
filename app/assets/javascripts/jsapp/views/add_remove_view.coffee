App.AddRemoveView = Ember.View.extend Ember.TargetActionSupport,
  tagName: 'button'
  click: ->
    action = @get('action')
    if @get('target') == 'view'
      @[action]()
    else
      rowNumber = @get('row')
      ctrl = @get('controller.controllers.wall')
      ctrl.send(action, rowNumber)

  mouseEnter: ->
    if @get('action') == "deleteRow"
      $(".row-#{@get('row')}").addClass('highlight')

  mouseLeave: ->
    $(".row").removeClass('highlight')

  showForm: ->
    $('.new-wall-overlay')
      .fadeIn()
      .find('input').focus()
