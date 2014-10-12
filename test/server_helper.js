'use strict';

process.env.NODE_ENV = 'test';

var knexConfig = require('../knexfile.js').test;
var knex = require('knex')(knexConfig);

require('chai').use(require('sinon-chai'));

GLOBAL.__fixture = function(name) {
  var _ = require('lodash');
  var path = require('path');
  return _.cloneDeep(require(path.join(__dirname, 'fixtures', name)));
};

exports.setUpDBFixtures = function() {
  knex('users').insert({
    username: 'dmitry',
    passwordDigest: '$2a$12$2NszbakvCtKXJj6eB6hx6u3sJMAYnF837HZJGbkm.SzTMyK3DFi0u'
  }).catch(function(err) {
    console.log('couldnt set up fixtures!:' + err);
  });

  knex('tokens').insert({
    user_id: '24',
    value: '8c61d9cf614b08e7eccb88ae56adb3d39216bbdc'
  }).catch(function(err) {
    console.log('couldnt set up fixtures!:' + err);
  });
};

exports.tearDownDBFixtures = function() {

};
