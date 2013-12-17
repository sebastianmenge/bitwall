App.NoteController = Ember.ObjectController.extend
  needs: ['wall']
  init: ->
    notes = @get('controllers.wall.notes')
    @set('allNotes', notes)

  actions:
    update: (value)->
      note = @get('content')
      note.saveRecord()

    delete: ->
      alert "You really wanna delete this note?"
      note = @get('content')
      note.deleteRecord()
      @allNotes.removeObject(note)

