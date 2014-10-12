'use strict';

module.exports = function (App) {
  App.Router.map(function() {
    this.route('tweets');
    this.route('submit');
    this.route('signup');
    this.route('login');
    this.route('logout');
    this.route('profile');
  });
};

  App.ProfileRoute = Ember.Route.extend(Ember.AdmitOne.AuthenticatedRouteMixin, {
  });

  App.LoginRoute = Ember.Route.extend({
    beforeModel: function() {
      this._super();
      if (this.get('session').get('isAuthenticated')) {
        this.transitionTo('profile');
      }
    }
  });

  App.LogoutRoute = Ember.Route.extend({
  beforeModel: function() {
    this._super();
    var self = this;
    var session = this.get('session');
    return session.invalidate().finally(function() {
      self.transitionTo('index');
    });
  }
});

App.SignupRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord('user');
  }
});

App.TweetsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('tweet');
  }
});

App.SubmitRoute = Ember.Route.extend({
  actions: {
    submitTweet: function() {
      var self = this;
      this.set('error', undefined);
      var tweet = this.store.createRecord('tweet', {
        tweet: this.get('controller.tweet'),
        timestamp: new Date(),
        user_id: this.controllerFor('application').get('session').get('id')
      });

      tweet.save()
      .then(function() {
        tweet.deleteRecord();
        self.transitionTo('tweets');
      })
      .catch(function(error) {
        if (error.responseJSON) { error = error.responseJSON; }
        if (error.error) { error = error.error; }
        self.set('error', error);
      });
    }
  }
});

