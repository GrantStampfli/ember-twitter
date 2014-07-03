'use strict';

var util = require('util');
var bluebird = require('bluebird'), Promise = bluebird;
var request = require('request'),
    requestAsync = bluebird.promisify(request, request);
var app = require('../../server/application');
var port = 383273;
var baseURL = util.format('http://localhost:%d', port);

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
  it('will get posts/barks', function(done){
		var fixture = __fixture('example');
		requestFixture(fixture).spread(function(response, body){
			console.log(response);
  		console.log(body);

  		var json = JSON.parse(body);
  		expect(json).to.eql(fixture.response.json);
  	}).done(function(){ done(); },done);
  });
});


