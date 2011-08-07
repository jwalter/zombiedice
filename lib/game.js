var Backbone = require('backbone');
var PlayerCollection = require('./playercollection.js');
var Turn = require('./turn.js');
var uuid = require('node-uuid');

var Game = Backbone.Model.extend({
  initialize: function(options) {
    var id = options.id;
    if (!id) {
      id = uuid();
    }
    this.id = id;
    this.name = options.name;
    this.activePlayerIdx = 0;
    this.alive = true;
    this.state = 'WAITING';
    this.players = new PlayerCollection();
    this.scores = new Array();
    this.turn = new Turn();
  },
  setNextPlayerActive: function() {
    if (!this.activePlayerIdx) {
      this.activePlayerIdx = 0;
    }
    this.activePlayerIdx = this.activePlayerIdx + 1;
    if (this.activePlayerIdx >= this.players.length) {
      this.activePlayerIdx = 0;
    }
    this.turn = new Turn();
  },
  start: function() {
    this.state = 'STARTED';
    this.setNextPlayerActive();
  },
  roll: function() {
    this.turn.roll();
  },
  stop: function() {
    addScore();
    endTurn();
  },
  turnState: function() {
    return {
      alive: this.turn.brains < 3,
      tableBrains: this.turn.brains,
      tableShotguns: this.turn.shotguns,
      dice: this.turn.dice
    };
  },
  endTurn: function() {
    this.alive = true;
    var newScore = this.scores[this.currentActivePlayer().id] + this.turn.brains;
    this.scores[this.currentActivePlayer().id] = newScore;
    this.currentActivePlayer.score = newScore;
    this.setNextPlayerActive();
  },
  waitingForPlayers: function() {
    return this.state === 'WAITING';
  },
  addPlayer: function(player) {
    this.players.add(player);
    this.scores[player.id] = 0;
  },
  currentActivePlayer: function() {
    return this.players.at(this.activePlayerIdx);
  },
  scoreOf: function(p) {
    return this.scores[p.id];
  }
});

module.exports = Game;