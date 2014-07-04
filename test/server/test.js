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

var Bark = models.Bark,
	  User = models.User;

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
	afterEach(function(done) {
		models._bookshelf.knex('barks').del().then(function() { done(); }, done);
	});
  it('will get barks', function(done){
		var fixture = __fixture('example');

		var userSavePromises = function() {
			return fixture.response.json.users.map(function(user) {
				var create = {
					username: user.username,
					passwordDigest: 'digest'
				};
				return User.forge(create).save().then(function(author) {
					return author;
				});
			});
		};

		var barkSavePromises = function(users) {
			return fixture.response.json.barks.map(function(bark, idx) {
				var create = {
					content: bark.content,
					author_id: users[idx].id
				};
				return Bark.forge(create).save();
			});
		};
		// Bark.forge({}).save().then(function(bark) {

		// }).done();
		// create barks

		Promise.all(userSavePromises()).then(function(users) {
			return Promise.all(barkSavePromises(users));
		})
		.then(function() {
			return requestFixture(fixture);
		})
		.spread(function(response, body){
  		var json = JSON.parse(body);
  		json.barks[0].id = fixture.response.json.barks[0].id;
  		json.barks[0].author = fixture.response.json.barks[0].author;
  		json.users[0].id = fixture.response.json.users[0].id;
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


