App.Router.map ->
  @resource 'walls'
  @route 'wall', { path: '/wall/:wall_id' }
