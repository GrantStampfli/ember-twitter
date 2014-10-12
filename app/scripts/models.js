'use strict';

module.exports = function(App){
  var attr = DS.attr;

	App.User = DS.Model.extend({
	  username: DS.attr('string'),
	  password: DS.attr('string')
	});

	App.Tweet = DS.Model.extend({
	  user_id: DS.attr('number'),
	  timestamp: DS.attr('date'),
	  tweet: DS.attr('string'),
	  username: DS.attr('string')
	});

};
