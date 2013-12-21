App.NewWallView = Ember.View.extend
  tagName: 'input'
  keyDown: (e)->
    if e.keyCode == 13
      val = @.$().val()
      console.log val
      @get('controller').send('createWall', val)
