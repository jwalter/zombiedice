// Module dependencies.
var express = require('express');
require('jade');
var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);
var _und = require('underscore');

var Game = require('./lib/game');
var GameTracker = require('./lib/gametracker');
var Player = require('./lib/player');
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
  if (!req.session.player) {
    req.session.player = new Player({name: 'anonymous'});
    console.log('Create new player: ' + req.session.player.cid);
  }
  res.render('index', {
    title: 'Zombie dice',
    games: gameTracker.models,
    name: req.session.player.name,
    playerId: req.session.player.id
  });
});

app.get('/name/:name', function(req, res) {
  if (req.params) {
    console.log('name: ' + req.params.name);
    req.session.player.name = req.params.name;
  }
  res.redirect('/');
});

app.post('/game/add', function(req, res) {
  if (req.params) {
    console.log('adding game "' + req.body.name + '"');
    var g = new Game({name: req.body.name});
    gameTracker.add(g);
  }
  res.send({result: 'Created new game '});
});

app.get('/game/:id/roll', function(req, res) {
  var gameCid = req.params.id;
  var game = gameTracker.getByCid(gameCid);
  //game.roll();
  // Push game/table state to clients
  var dice = getDice();
  var brains = 0;
  var shotguns = 0;
  _und.each(dice, function(die) {
    if (die.side === 'brains') {
      brains = brains + 1;
    }
    if (die.side === 'shotgun') {
      shotguns = shotguns + 1;
    }
  });
  for (i = 0; i < socks.length; i++) {
    socks[i].emit('updateTable', {
      dice: dice,
      tableBrains: brains,
      tableShotguns: shotguns,
      activePlayer: game.currentActivePlayer().id,
      alive: true });
  }
  res.send('');
});

app.get('/game/:id', function(req, res) {
  var game = gameTracker.getByCid(req.params.id);
  var p = req.session.player;
  console.log('Now id is: ' + p.id);
  if (!game.players.get(p.id)) {
    game.addPlayer(p);
  }
  res.render('games/index.jade', {
    game: game,
    title: game.name
  });
});

var socks = new Array();

app.get('/game/:id/endTurn', function(req, res) {
  var gameCid = req.params.id;
  var game = gameTracker.getByCid(gameCid);
  game.endTurn();
  var p = game.currentActivePlayer();
  for (i = 0; i < socks.length; i++) {
    socks[i].emit('updateTable', {
      tableBrains: 0,
      tableShotguns: 0,
      activePlayer: game.currentActivePlayer().id,
      alive: true });
  }
  res.send('');
});

// START Temporary dice stuf
function getDice() {
  var result = new Array();
  for (var i = 0; i < 3; i++) {
    rollDie(function(die) {
      result[i] = die;
    });
  }
  return result;
}

var dieColors = ["red", "yellow", "green"];
var dieSides = ["shotgun", "feet", "brains"];

function rollDie(fn) {
  var colorIdx = Math.floor(Math.random()*3);
  var sideIdx = Math.floor(Math.random()*3);
  fn({color: dieColors[colorIdx], side: dieSides[sideIdx]});
}
// END Temporary dice stuf

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('join game', function (data, fn) {
    var g = gameTracker.getByCid(data);
    console.log('Join game: ' + data);
    fn('Success');
  });
  socks.push(socket);
});
// Prototype socketio stuff end

app.listen(11033);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
