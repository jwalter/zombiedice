var Backbone = require('backbone');
var PlayerCollection = require('./playercollection.js');

var Game = Backbone.Model.extend({
  initialize: function(options) {
    this.name = options.name;
    this.activePlayerIdx = 0;
    this.alive = true;
    this.state = 'WAITING';
    this.players = new PlayerCollection();
  },
  setNextPlayerActive: function() {
    if (!this.activePlayerIdx) {
      this.activePlayerIdx = 0;
    }
    this.activePlayerIdx = this.activePlayerIdx + 1;
    if (this.activePlayerIdx >= this.players.length) {
      this.activePlayerIdx = 0;
    }
  },
  start: function() {
    this.state = 'STARTED';
    this.setNextPlayerActive();
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
    return {
      alive: alive,
      brains: brains,
      shotguns: shotguns,
      latestRolledDice: dice
    };
  },
  endTurn: function() {
    this.alive = true;
    this.setNextPlayerActive();
  },
  waitingForPlayers: function() {
    return this.state === 'WAITING';
  },
  addPlayer: function(player) {
    this.players.add(player);
  },
  currentActivePlayer: function() {
    return this.players.at(this.activePlayerIdx);
  }
});

module.exports = Game;