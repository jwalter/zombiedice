var assert = require('assert'),
  gametracker = require('../lib/gametracker.js');
 
module.exports = {
    'new gametracker should have zero games': function() {
        assert.length(gametracker.allGames(), 0);

    },
    'adding one game increases total number of games': function() {
      gametracker.add('foo');
      assert.length(gametracker.allGames(), 1);
    },
    'name of added game should match parameter': function() {
      assert.equal(gametracker.allGames()[0].name, 'foo');
    }
};