'use strict';


App.ApplicationAdapter = DS.FixtureAdapter.extend({
	namespace: 'ember-twitter'
});
App.Posts.FIXTURES = __fixture('example').posts;

describe('app', function() {
	beforeEach(function() {
		var container = applicationContainer();
		var session = container.lookup('auth-session:main');
		session.set('content', {
		  username: 'fake-username',
		  token: 'fake-token'
		});
		it('has one passing test', function() {});
  	console.log(App.Posts.FIXTURES);
 	 	it('will have more tests');
	});
});
