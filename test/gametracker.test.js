var assert = require('assert'),
  GameTracker = require('../lib/gametracker.js'),
  Game = require('../lib/game.js');

var underTest = new GameTracker();
module.exports = {
    'new gametracker should have zero games': function() {
        assert.length(underTest, 0);
    },
    'adding one game increases total number of games': function() {
      underTest.add(new Game({name: 'foo'}));
      assert.length(underTest, 1);
    },
    'name of added game should match parameter': function() {
      assert.equal(underTest.at(0).name, 'foo');
    }
};