/* global describe, it, App, DS */
'use strict';

var fixture = require('./fixtures/example.json');

App.ApplicationAdapter = DS.LSAdapter.extend({
	namespace: 'ember-twitter'
});

describe('app', function() {
  it('has one passing test', function() {});
  it('will have more tests');
});
