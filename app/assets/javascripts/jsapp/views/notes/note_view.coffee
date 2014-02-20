App.NoteView = Ember.View.extend Ember.TargetActionSupport,
  classNames: ['note-element']
  attributeBindings: ['style']
  templateName: "notes/note"
  toolbarId: (->
    id = Math.floor(Math.random() * (100 -10) * 10)
    "bitlog-wysi-#{id}"
  ).property()

  mouseEnter: ->
    @toggleSettings('In')

  mouseLeave: ->
    @toggleSettings('Out')

  toggleSettings: (toggle, time=100)->
    settings = @.$().find('.note-settings')
    settings["fade#{toggle}"](time)
