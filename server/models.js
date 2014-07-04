'use strict';

var config = require('./config');
var knexConfig = require('../knexfile.js')[config.env];
var knex = require('knex')(knexConfig);
var bookshelf = require('bookshelf')(knex);

var User, Token, Bark;
User = bookshelf.Model.extend({
  tokens: function() {
    return this.hasMany(Token);
  },
  barks: function() {
    return this.hasMany(Bark);
  },
  tableName: 'users'
});
Token = bookshelf.Model.extend({
  user: function() {
    return this.belongsTo(User);
  },
  tableName: 'tokens'
});
Bark = bookshelf.Model.extend({
  author: function() {
    return this.belongsTo(User, 'author_id');
  },
  tableName: 'barks'
});

module.exports = {
	User: User,
	Token: Token,
	Bark: Bark,
	_bookshelf: bookshelf // only for testing
};
