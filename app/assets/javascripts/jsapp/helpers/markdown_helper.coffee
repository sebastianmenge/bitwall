Ember.Handlebars.helper 'markdown', (input)->
  showdown = new Showdown.converter()
  new Handlebars.SafeString(showdown.makeHtml(input))

