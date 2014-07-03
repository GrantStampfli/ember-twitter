'use strict';
var expect = require('chai').expect;
var util = require('util');
var bluebird = require('bluebird'), Promise = bluebird;
var request = require('request'),
    requestAsync = bluebird.promisify(request, request);
var app = require('../../server/application');
var models = require('../../server/models');
var port = 383273;
var baseURL = util.format('http://localhost:%d', port);

var Bark = models.Bark;

var requestFixture = function(fixture) {
	var requestOptions = {
		url: baseURL + fixture.request.url,
		method: fixture.request.method,
		headers: fixture.request.headers,
	};
	return requestAsync(requestOptions);
};

describe('server', function() {
	before(function(done) { this.server = app.listen(port, function() { done(); }); });
	after(function(done) { this.server.close(done); });
  it('will get barks', function(done){
		var fixture = __fixture('example');

		// create barks

		requestFixture(fixture).spread(function(response, body){
  		var json = JSON.parse(body);
  		expect(json).to.eql(fixture.response.json);
  	}).done(function(){ done(); },done);
  });
  it.skip('will post barks', function(done){
		var fixture = __fixture('postBark');
		requestFixture(fixture).spread(function(response, body){
  		var json = JSON.parse(body);
  		expect(json).to.eql(fixture.response.json);
  	}).done(function(){ done(); },done);
  });
});


