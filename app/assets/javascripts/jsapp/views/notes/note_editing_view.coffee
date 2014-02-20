App.NoteEditingView = Ember.TextArea.extend
  strokes: []
  didInsertElement: ->
    @debouncedSave = _.debounce((=>@autoSave()), 4000)
    @activateWysi()
    _.delay (=>
      @.$().parents('.note-element').find('iframe').show())
    , 100

  activateWysi: ->
    id = @.$().attr('id')
    toolbarId = @get('parentView.toolbarId')
    editor = new wysihtml5.Editor id,
      toolbar:      toolbarId
      parserRules:  wysihtml5ParserRules
      autoLink: true
      stylesheets: ["/wysi.css"]
      useLineBreaks: false
    @activateEvents()

  activateEvents: ->
    parentEl = @.$().parents('.note-element')
    toolbar = parentEl.find('.bitlog-wysi')
    editor = parentEl.find('.wysihtml5-sandbox').contents().find('body')
    editor.on "blur", =>
      toolbar.fadeOut(200)
    editor.on "focus", ->
      toolbar.fadeIn(200)

    editor.on "keyup", (e)=>
      @saveByStrokes(e)
      @debouncedSave()

  saveByStrokes: (e)->
    @get('strokes').push(e.keyCode)
    if @get('strokes').length > 25
      @autoSave()
      @set('strokes', [])

  autoSave: ->
    val = @.$().val()
    @get('parentView.controller').send('update', {body: val})
