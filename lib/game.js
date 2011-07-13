var Backbone = require('backbone');

var Game = Backbone.Model.extend({
  initialize: function(options) {
    this.name = options.name;
    this.alive = true;
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
  }
});

module.exports = Game;