App.WallsController = Ember.ArrayController.extend()

App.WallController = Ember.ObjectController.extend
  needs: ['walls']
  init: ->
    @_super()
  actions:
    createRow: ->
      if @get('rows').length == 4
        alert "Uhhh, this will get messy soon. Try creating a new wall."
      else
        diff = (_.difference([1, 2, 3, 4], @get('rows')))[0]
        @set('rows', @get('rows').addObject(diff))
        wall = @get('content')
        wall.set('isDirty', true)
        wall.saveRecord()
        @send('createNote', diff)

    deleteRow: (row)->
      if @get('rows').length == 1
        alert "Sorry, you cant delete the last row."
      else
        if confirm "Do you really wanna delete this row?"
          notes = @get('notes')
          toDelete = notes.filterBy('row', row)
          rows = @get('rows').removeObject(row)
          notes.removeObjects(toDelete)
          @_batchDelete(toDelete, rows)

    createWall: (name)->
      wall = App.Wall.create(name: name, rows: [1])
      wall.saveRecord()
      @get('controllers.walls').addObject(wall)
      wall.on 'didCreate', =>
        $('.new-wall-overlay').fadeOut()
        @transitionToRoute('wall', wall)

    deleteWall: ->
      if confirm "Do you really wanna destroy this entire wall?"
        walls = @get('controllers.walls')
        wall = @get('content')
        wall.deleteRecord()
        walls.removeObject(wall)
        @transitionToRoute('wall', walls.objectAt(0))

    createNote: (row)->
      note = App.Note.create
        wallId: @get('id')
        color: '#efe387'
        row: row
        width: null
      note.saveRecord()
      @get('notes').addObject(note)

# Properties -------------------------------------------

  row_1: (->
    @get('notes').filterBy('row', 1)
  ).property('notes.@each')

  row_2: (->
    @get('notes').filterBy('row', 2)
  ).property('notes.@each')

  row_3: (->
    @get('notes').filterBy('row', 3)
  ).property('notes.@each')

  row_4: (->
    @get('notes').filterBy('row', 4)
  ).property('notes.@each')

  row_5: (->
    @get('notes').filterBy('row', 5)
  ).property('notes.@each')

# Private -------------------------------------------

  _batchDelete: (notes, rows)->
    ids = notes.map (note, i, a)->note.get('id')
    $.ajax
      url: "api/notes/batch_destroy.json"
      method: "POST"
      data:
        ids: ids
        wall_id: @get('id')
        rows: rows

