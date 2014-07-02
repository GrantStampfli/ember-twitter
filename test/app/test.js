'use strict';

describe('app', function() {
	before(function () {
		this.server = sinon.fakeServer.create();
		this.server.autoRespond = true;
	});
	after(function () { this.server.restore(); });

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
		 	this.server.respondWith('GET', '/api/posts',
		 		[200, { 'Content-Type': 'application/json' },
		 		 JSON.stringify(__fixture('example'))]);
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
