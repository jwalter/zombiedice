var assert = require('assert'),
  Game = require('../lib/game.js');
 
module.exports = {
    'player should be alive at start of game': function() {
      var g = new Game({ name: 'test'});
      assert.equal(g.alive, true);
    },
    'player should be alive at start of each turn': function() {
      var g = new Game({ name: 'test'});
      g.alive = false;
      g.endTurn();
      assert.equal(g.alive, true);
    }

};