var Game = require('./game.js');
var games = new Array();

exports.allGames = function () {
  return games;
}

exports.add = function(name) {
  var g = new Game({ 'name': name });
  games.push(g);
}
