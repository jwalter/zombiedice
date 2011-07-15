var assert = require('assert'),
  PlayerCollection = require('../lib/playercollection.js'),
  Player = require('../lib/player.js');

var underTest = new PlayerCollection();
module.exports = {
    'new playercolletion should have zero players': function() {
        assert.length(underTest, 0);
    },
    'adding one player increases total number of players': function() {
      underTest.add(new Player({name: 'foo'}));
      assert.length(underTest, 1);
    }
};