var Backbone = require('backbone');
var _und = require('underscore');

var Turn = Backbone.Model.extend({
  initialize: function(options) {
    this.dieColors = ["red", "yellow", "green"];
    this.dieSides = ["shotgun", "feet", "brains"];
    this.brains = 0;
    this.shotguns = 0;
    this.dice = new Array();
  },
  dice: function() {
    return this.dice;
  },
  roll: function() {
    this.dice = this.rollDice();
    this.updateScore();
  },
  stop: function() {
    addScore();
    endTurn();
  },
  toJSON: function() {
    return {
      alive: this.brains < 3,
      brains: this.brains,
      shotguns: this.shotguns,
      latestRolledDice: this.dice
    };
  },
  rollDice: function() {
    var result = new Array();
    for (var i = 0; i < 3; i++) {
      this.rollDie(function(die) {
        result[i] = die;
      });
    }
    return result;
  },
  rollDie: function(fn) {
    var colorIdx = Math.floor(Math.random()*3);
    var sideIdx = Math.floor(Math.random()*3);
    fn({color: this.dieColors[colorIdx], side: this.dieSides[sideIdx]});
  },
  updateScore: function() {
    var parent = this;
    console.log('Update score START');
    _und.each(this.dice, function(die) {
      if (die.side === 'brains') {
        console.log('Add 1 brain');
        parent.brains = parent.brains + 1;
      }
      if (die.side === 'shotgun') {
        console.log('Add 1 shotgun');
        parent.shotguns = parent.shotguns + 1;
      }
    });
    console.log('Update score END');
  }
});

module.exports = Turn;