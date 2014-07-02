'use strict';
// use ephemeral store for authentication data
Ember.Application.initializer({
  name: 'authentication-test',
  initialize: function(container, application) {
    var Ephemeral = Ember.AdmitOne.Storage.Base.extend({
      data: null,
      persist: function(data) { this.set('data', data); },
      restore: function() { return this.get('data'); },
      clear: function() { this.set('data'); }
    });
    application.register('auth-session-storage:ephemeral', Ephemeral);
    application.register('auth-session-storage:test', Ephemeral);
    App.AdmitOneContainers.storage = 'auth-session-storage:test';
  }
});

Ember.Test.registerHelper('applicationContainer', function(app) {
  return app.__container__;
});

Ember.LOG_VERSION = false;
Ember.testing = true;
Ember.Application.reopen({
  init: function() {
    this._super();
    this._setupTestApplication();
  },

  _setupTestApplication: function() {
    var testingElementID = 'ember-test-application';
    this.rootElement = '#' + testingElementID;
    this.setupForTesting();
    this.injectTestHelpers();
    Ember.$('body').append(Ember.$('<div id="' + testingElementID + '"/>'));
  }
});


// expose fixtures property (stored in __html__ via karma preprocessor)
window.__fixture = function(name) {
  var fixture = window.__html__['test/fixtures/' + name + '.json'];
  if (!fixture) { throw new Error('Missing fixture ' + name); }
  return JSON.parse(fixture);
};
