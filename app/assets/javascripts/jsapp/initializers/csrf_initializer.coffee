Ember.Application.initializer
  name: "csrfToken"
  initialize: ->
    csrfToken = $('meta[name=csrf-token]').attr('content')
    Ember.debug(csrfToken)
    $(document).ajaxSend (event, xhr, ajaxSettings, thrownError)->
      xhr.setRequestHeader("Accept", "application/json")
      xhr.setRequestHeader("X-CSRF-Token", csrfToken)
