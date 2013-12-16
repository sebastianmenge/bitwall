App.NoteController = Ember.ObjectController.extend
  needs: ['wall']

  update: (value)->
    $.ajax
      type: 'PUT',
      url:  "api/notes/#{@get('id')}"
      data:
        note: value
      dataType: "JSON",
      success: (data)->
