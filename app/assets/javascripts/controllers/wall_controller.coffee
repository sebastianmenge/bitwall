App.WallController = Ember.ObjectController.extend
  init: ->
    @_super()

  actions:
    createRow: ->
      rows = @get('rows')
      @set('rows', rows + 1)

    createWall: ->
      alert "create wall"

    deleteRow: ->
      rows = @get('rows')
      @set('rows', rows - 1)

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


  notes: (->
    Ember.ArrayProxy.createWithMixins Ember.SortableMixin,
      content: @get('content.notes')
      sortProperties: ['id']
  ).property('content.notes')

  numberOfRows: (->
    rows = @get('rows')
    [1..rows]
  ).property('rows')

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
    @get('notes').filterBy('row', 1)
  ).property('notes.@each')
