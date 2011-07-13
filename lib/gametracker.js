var Game = require('./game.js');
var Backbone = require('backbone');

var GameTracker = Backbone.Collection.extend({
  model: Game
});

module.exports = GameTracker;