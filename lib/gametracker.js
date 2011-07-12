var Game = require('./game.js');
var games = new Array();
games.push(new Game());

exports.allGames = function () {
  return games;
}
