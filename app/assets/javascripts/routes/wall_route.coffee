App.WallsRoute = Ember.Route.extend
  model: ->
    App.Wall.fetch()
  afterModel: (walls, transition)->
    lastVisitedId = localStorage.getItem('last_visited_wall')
    wall = walls.findBy('id', lastVisitedId)
    @transitionTo('wall', walls.objectAt(0))
    # if lastVisitedId?
    #   @transitionToRoute('wall', wall)
    # else
    #   @transitionToRoute('wall', walls.objectAt(0))

App.WallRoute = Ember.Route.extend
  beforeModel: (params)->
    localStorage.setItem('last_visited_wall', params.providedModels.wall.get('id'))

  model: (params)->
    App.Wall.fetch(params.wall_id)

