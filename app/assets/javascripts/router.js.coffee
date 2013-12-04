App.Router.map ->
  @resource 'wall', { path: '/wall/:wall_id' }, ->
    @resource 'notes', { path: '/notes' }
