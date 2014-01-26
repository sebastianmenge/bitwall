App.Router.map ->
  @resource 'walls', ->
    @resource 'wall', { path: '/:wall_id' }
