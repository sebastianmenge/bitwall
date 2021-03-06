App.NoteController = Ember.ObjectController.extend
  needs: ['wall']
  init: ->
    notes = @get('controllers.wall.notes')
    @set('allNotes', notes)

  actions:
    update: (obj)->
      note = @get('content')
      note.setProperties(obj)
      note.saveRecord()

    delete: ->
      if confirm "You really wanna delete this note?"
        note = @get('content')
        note.deleteRecord()
        @allNotes.removeObject(note)

