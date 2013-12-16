App.WallsRoute = Ember.Route.extend
  model: ->
    App.Wall.fetch()
  afterModel: (walls, transition)->
    @transitionTo('wall', walls.objectAt(0))

App.WallRoute = Ember.Route.extend
  model: (params)->
    App.Wall.fetch(params.wall_id)
