var assert = require('assert'),
  Player = require('../lib/player.js');
 
module.exports = {
    'player name should match constructor param': function() {
      var p = new Player({ name: 'test player'});
      assert.equal(p.name, 'test player');
    }
};