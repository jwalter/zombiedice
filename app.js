// Module dependencies.
var express = require('express');
require('jade');
var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

var Game = require('./lib/game');
var GameTracker = require('./lib/gametracker');
var Player = require('./lib/player');
var PlayerCollection = require('./lib/playercollection.js');
var gameTracker = new GameTracker();
var players = new PlayerCollection();

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
  var g = new Game({name: 'test game'});
  gameTracker.add(g);
});

app.configure('production', function() {
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res) {
  if (!req.session.player) {
    var p = new Player({name: 'anonymous'});
    req.session.player = p;
    players.add(p);
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

app.get('/game/:id', function(req, res) {
  var game = gameTracker.getByCid(req.params.id);
  var pid = req.session.player.id;
  var p = players.get(pid);
  console.log('Now id is: ' + p.id);
  if (!game.players.get(p.id)) {
    game.addPlayer(p);
    toAllClients('addPlayer', p.toJSON());
  }
  res.render('games/index.jade', {
    game: game,
    gameId: game.id,
    title: game.name,
    playerid: p.id
  });
});

app.get('/game/:id/roll', function(req, res) {
  var gameCid = req.params.id;
  var game = gameTracker.getByCid(gameCid);
  game.roll();
  var turnState = game.turnState();
  toAllClients('updateTable', {
      dice: turnState.dice,
      tableBrains: turnState.tableBrains,
      tableShotguns: turnState.tableShotguns,
      activePlayer: game.currentActivePlayer().id,
      alive: true });
  res.send('');
});

var socks = new Array();

app.get('/game/:id/endTurn', function(req, res) {
  var gameCid = req.params.id;
  var game = gameTracker.getByCid(gameCid);
  game.endTurn();
  var p = game.currentActivePlayer();
  toAllClients('resetTable', {
      activePlayer: game.currentActivePlayer().id,
      scoreUpdate: { playerId: p.id, score: game.scoreOf(p) }
    });
  res.send('');
});

function toAllClients(action, data) {
  for (i = 0; i < socks.length; i++) {
    socks[i].emit(action, data);
  }
}

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('join game', function (data, fn) {
    console.log('Join game: ' + data.gameId);
    var g = gameTracker.get(data.gameId);
    if (g) {
      fn(g.currentActivePlayer().id, g.players);
    }
  });
  socks.push(socket);
});

app.listen(11033);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
