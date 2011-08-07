var assert = require('assert'),
  Game = require('../lib/game.js');
  Player = require('../lib/player.js');
 
module.exports = {
    'new game should be in waiting state': function() {
      var g = new Game();
      assert.equal(g.waitingForPlayers(), true);
    },
    'game should not be waiting for players when started': function() {
      var g = new Game();
      g.start();
      assert.equal(g.waitingForPlayers(), false);
    },
    'first player is currently active for new game': function() {
      var g = new Game();
      var p = new Player();
      g.addPlayer(p);
      assert.equal(g.currentActivePlayer(), p);
    },
    'second player is currently active after first player turn ends': function() {
      var g = new Game();
      var p1 = new Player();
      var p2 = new Player();
      g.addPlayer(p1);
      g.addPlayer(p2);
      g.endTurn();
      assert.equal(g.currentActivePlayer(), p2);
    },
    'first player is currently active after last player turn ends': function() {
      var g = new Game();
      var p1 = new Player();
      var p2 = new Player();
      g.addPlayer(p1);
      g.addPlayer(p2);
      g.endTurn();
      g.endTurn();
      assert.equal(g.currentActivePlayer(), p1);
    },
    'score uses player id as key': function() {
      var g = new Game();
      var p = new Player();
      g.addPlayer(p);
      assert.equal(g.scores[p.id], 0);
    }
};