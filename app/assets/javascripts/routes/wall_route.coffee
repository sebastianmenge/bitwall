App.WallsRoute = Ember.Route.extend
  model: ->
    @get('store').find('wall', 1)
  afterModel: (walls, transition)->
    @transitionTo('wall', walls)

App.WallRoute = Ember.Route.extend
  model: (params)->
    @get('store').find('wall', params.wall_id)
