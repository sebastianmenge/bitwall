App.NoteView = Ember.View.extend
  classNames: ['note-element']
  attributeBindings: ['style']
  templateName: "notes/note"
  style: (->
    color = @get('color')
    "background: #{color};"
  ).property('color')

  mouseEnter: ->
    @toggleSettings('In')

  mouseLeave: ->
    @toggleSettings('Out')

  toggleSettings: (toggle, time=100)->
    settings = @.$().find('.note-settings')
    settings["fade#{toggle}"](time)
