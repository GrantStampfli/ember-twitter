'use strict';

var expect = require('chai').expect;
var request = require('request');
var server = require('../../server/application');
var helpers = require('../server_helper');

describe('twitter API', function() {
  before(function() {
    server.listen(9000);
    //helpers.setUpDBFixtures();
    this.postFixture = __fixture('posttweet');
    this.getFixture = __fixture('gettweet');
  });

  it('creates tweets', function(done) {
    request({
      url: 'http://localhost:' + '9000' + this.postFixture.request.url,
      method: 'POST',
      headers: this.postFixture.request.headers,
      json: this.postFixture.request.json
    }, function(err, res, body) {
      console.log(err);
      console.log(body);
      done();
    });
  });
});
