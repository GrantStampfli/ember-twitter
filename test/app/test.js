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
	});
	afterEach(function() {
		App.reset();
	});
	describe('profile page', function() {
		beforeEach(function() {
			visit('profile');
		});
		it('is on profile page', function() {
			expect(currentRouteName()).to.eql('profile');
		});
		it('shows posts from current user', function() {
			expect(find('author').text()).to.eql('fake-username');
		});
	});
});
