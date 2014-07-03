'use strict';

var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var compression = require('compression');
var favicon = require('serve-favicon');
var config = require('./config');
var knexConfig = require('../knexfile.js')[config.env];
var knex = require('knex')(knexConfig);
var bookshelf = require('bookshelf')(knex);

var app = express();

if (config.env === 'development') {
  var connectLivereload = require('connect-livereload');
  app.use(connectLivereload({ port: process.env.LIVERELOAD_PORT || 35729 }));
  app.use(morgan('dev'));
  app.use(express.static(config.public));
  app.use(express.static(path.join(__dirname, '../app')));
}
if (config.env === 'production') {
  app.use(morgan('default'));
  app.use(favicon(path.join(config.public, 'favicon.ico')));
  app.use(express.static(config.public));
  app.use(compression());
}
app.use(bodyParser.json());
app.use(methodOverride());


var User, Token;
User = bookshelf.Model.extend({
  tokens: function() {
    return this.hasMany(Token);
  },
  tableName: 'users'
});
Token = bookshelf.Model.extend({
  user: function() {
    return this.belongsTo(User);
  },
  tableName: 'tokens'
});

var admit = require('admit-one')('bookshelf', {
  bookshelf: { modelClass: User }
});

var api = express.Router();

api.post('/users', admit.create, function(req, res) {
  // user accessible via req.auth.user
  res.json({ user: req.auth.user });
});

api.post('/sessions', admit.authenticate, function(req, res) {
  // user accessible via req.auth.user
  res.json({ status: 'ok' });
});

api.get('/barks', function(req, res){
  res.json({ barks:[
  { id:1, author: 0, date: "2014-07-01", "content": "this is some content from Ariel"},
  { id:2, author: 1, date: "2014-06-05", "content": "this is some content from Tian"},
  { id:3, author: 2, date: "2014-05-05", "content": "this is some content from Grant"}
]
});
});

// all routes defined from here on will require authorization
api.use(admit.authorize);
api.delete('/sessions/current', admit.invalidate, function(req, res) {
  if (req.auth.user) { throw new Error('Session not invalidated.'); }
  res.json({ status: 'ok' });
});

// application routes
app.use('/api', api);

// expose app
module.exports = app;

// start server
if (require.main === module) {
  app.listen(config.port, function() {
    return console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
  });
}
