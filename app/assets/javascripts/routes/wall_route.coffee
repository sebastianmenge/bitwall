App.WallRoute = Ember.Route.extend
  model: (params)->
    @get('store').find('wall', params.wall_id)

App.NotesRoute = Ember.Route.extend
  model: (params)->
    @get('store').findAll('note')
