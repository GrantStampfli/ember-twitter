'use strict';

describe('Ember twitter appliction', function() {

  before(function() {
    this.postFixture = __fixture('posttweet');
    this.getFixture = __fixture('gettweet');
    this.server = sinon.fakeServer.create();
    this.server.autoRespond = true;
  });

  after(function() {
    this.server.restore();
  });

  beforeEach(function() {
    App.reset();
  });

  it('creates a tweet', function(done) {

    // Set up Fake Server responses
    this.server.respondWith(this.postFixture.request.method,
      this.postFixture.request.url,
      [this.postFixture.response.status, { 'Content-Type': 'application/json' },
      JSON.stringify(this.postFixture.response.json)]);

    this.server.respondWith(this.getFixture.request.method,
      this.getFixture.request.url,
      [this.getFixture.response.status, { 'Content-Type': 'application/json' },
      JSON.stringify(this.getFixture.response.json)]);

    // Execute actual test
    visit('/submit');

    fillIn('input', this.postFixture.request.json.tweet.tweet);
    click('button');
    andThen(function() {
      expect(currentPath()).to.equal('tweets');
      expect(find('.panel-title').text()).to.contain(this.getFixture.response.json.tweets[0].username);
      expect(find('.panel-body').text()).to.contain(this.getFixture.response.json.tweets[0].tweet);
      done();
    }.bind(this));
  });

  it('will have more tests');
});
