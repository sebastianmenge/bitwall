App.NewWallView = Ember.View.extend
  tagName: 'input'
  keyDown: (e)->
    if e.keyCode == 13
      val = @.$().val()
      @get('controller').send('createWall', val)
      @.$().val("")
