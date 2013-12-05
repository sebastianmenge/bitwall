App.Router.map ->
  @resource 'walls', { path: '/walls' }
  @resource 'wall', { path: '/wall/:wall_id' }
