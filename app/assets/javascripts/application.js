//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require handlebars
//= require ember
//= require ember-data
//= require_self
//= require bitwall

window.App = Ember.Application.create();
App.ApplicationAdapter = DS.FixtureAdapter.extend();
