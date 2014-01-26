//= require jquery
//= jquery-ui-1.10.3.custom.min
//= require jquery_ujs
//= require turbolinks
//= require underscore-min.js
//= require handlebars
//= require ember
//= require ember-restless
//= require_self
//= require jsapp/bitlog

window.App = Ember.Application.create();

App.RESTAdapter = RL.RESTAdapter.create({
  namespace: '/api',
  useContentTypeExtension: true
});

App.Client = RL.Client.create({
  adapter: App.RESTAdapter
});
