'use strict';

module.exports = function(App){
  var attr = DS.attr;

	App.Posts = DS.Model.extend({
		author: DS.belongsTo('user'),
		date: attr('date'),
		content: attr('string')
	});

};
