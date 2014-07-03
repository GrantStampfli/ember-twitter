'use strict';

var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var compression = require('compression');
var favicon = require('serve-favicon');
var config = require('./config');

var app = express();

var models = require('./models'),
    User = models.User,
    Bark = models.Bark;

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

api.post('/barks', function(req, res) {
  // TODO Write bark to database
  res.json({});
});

api.get('/barks', function(req, res){
  Bark.fetchAll()
  .then(function(collection) {
    var barks = collection.toJSON().map(function(model) {
      model.author = model.author_id;
      delete model.author_id;
      return model;
    });
    res.json({barks: barks});
  }).done();
  // res.json({bark: [{
  //       id: 12,
  //       content: 'I\'m really excited about using this new Barker service!',
  //       author: 1
  //     }],
  //     users: [
  //       { id:1, username: 'Ariel', date: '2014-07-01'},
  //       { id:2, username: 'Tian', date: '2014-06-05'},
  //       { id:3, username: 'Grant', date: '2014-05-05'},
  //       { id:4, username: 'wbyoung', date: '2014-07-01'}
  //     ]
  // });
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
