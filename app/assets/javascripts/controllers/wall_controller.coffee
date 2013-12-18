App.WallsController = Ember.ArrayController.extend()

App.WallController = Ember.ObjectController.extend
  init: ->
    @_super()

  actions:
    createRow: ->
      next = @get('numberOfRows').length + 1
      console.log @get('numberOfRows')
      @get('numberOfRows').addObject(next)
      @get('content').saveRecord()

    deleteRow: (row)->
      if confirm "Do you really wanna delete this row?"
        notes = @get('notes')
        toDelete = notes.filterBy('row', row)
        notes.removeObjects(toDelete)
        @get('numberOfRows').removeObject(row)
        @batchDelete(toDelete)

    createWall: ->
      alert "create wall"

    updateWall: ->

    deleteWall: ->
      alert "delete wall"

    createNote: (row)->
      wall_id = @get('id')
      note = App.Note.create
        wallId: wall_id
        color: '#efe387'
        row: row
        width: null
      note.saveRecord()
      @get('notes').addObject(note)

  batchDelete: (notes)->
    ids = notes.map (note, i, a)->note.get('id')
    $.ajax
      url: "api/notes/batch_destroy.json"
      method: "POST"
      data:
        ids: ids
        wall_id: @get('id')
        rows: @get('numberOfRows').length

  # numberOfRows: (->
  #   rows = @get('rows')
  #   if rows > 0 then [1..rows] else false
  # ).property('rows')

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
