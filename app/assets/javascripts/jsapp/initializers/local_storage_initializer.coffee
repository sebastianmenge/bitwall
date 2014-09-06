Ember.Application.initializer
  name: "localStorage"
  initialize: ->
    namespace = localStorage.getItem('bitwall')
    if !namespace?
      localStorage.setItem('bitwall', {})
