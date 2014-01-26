Ember.Application.initializer
  name: "localStorage"
  initialize: ->
    namespace = localStorage.getItem('bitlog')
    if !namespace?
      localStorage.setItem('bitlog', {})
