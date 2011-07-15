// Module dependencies.
var express = require('express');
require('jade');
var app = module.exports = express.createServer();
var Game = require('./lib/game');
var GameTracker = require('./lib/gametracker');
var gameTracker = new GameTracker();

// Configuration
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'brainsaredelicious' }));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function() {
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res) {
  res.render('index', {
    title: 'Zombie dice',
    games: gameTracker.models,
    name: req.session.name
  });
});

app.get('/name/:name', function(req, res) {
  if (req.params) {
    console.log('name: ' + req.params.name);
    req.session.name = req.params.name;
  }
  res.redirect('/');
});

app.post('/game/add', function(req, res) {
  if (req.params) {
    console.log('adding game "' + req.body.name + '"');
    gameTracker.add(new Game({name: req.body.name}));
  }
  res.redirect('/');
});

app.get('/game/:id/roll', function(req, res) {
  gameTracker.roll(req, function(data) {
    res.send(data);
  });
});

app.get('/game/:id', function(req, res) {
  game = gameTracker.getByCid(req.params.id);
  res.render('games/index.jade', {
    game: game,
    title: game.name
  });
});

app.get('/roll', function(req, res) {
  res.send({ dice: 'You rolled ' + Math.floor(Math.random()*11)});
});

app.listen(8080);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
