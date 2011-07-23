// Module dependencies.
var express = require('express');
require('jade');
var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

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
  gameTracker.roll(req, function(data) {
    res.send(data);
  });
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
app.get('/roll', function(req, res) {
  var dice = getDice();
  for (i = 0; i < socks.length; i++) {
    socks[i].emit('roll', { dice: dice });
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

app.listen(8080);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
