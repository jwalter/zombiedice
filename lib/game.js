var Backbone = require('backbone');
var PlayerCollection = require('./playercollection.js');

var Game = Backbone.Model.extend({
  initialize: function(options) {
    this.name = options.name;
    this.alive = true;
    this.state = 'WAITING';
    this.players = new PlayerCollection();
  },
  start: function() {
    this.state = 'STARTED';
  },
  roll: function() {
    rollDice();
    if (alive) {
      addTurnScore();
    } else {
      resetTurnScore();
    }
  },
  stop: function() {
    addScore();
    endTurn();
  },
  turnState: function() {
    return { alive: alive,
      brains: brains,
      shotguns: shotguns,
      latestRolledDice: dice
    };
  },
  endTurn: function() {
    this.alive = true;
  },
  waitingForPlayers: function() {
    return this.state === 'WAITING';
  },
  addPlayer: function(player) {
    this.players.add(player);
  }
});

module.exports = Game;