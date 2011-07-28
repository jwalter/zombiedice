var assert = require('assert'),
  Turn = require('../lib/turn.js');
 
module.exports = {
    'no brains at turn start': function() {
      var t = new Turn();
      assert.equal(t.brains, 0);
    },
    'no shotguns at turn start': function() {
      var t = new Turn();
      assert.equal(t.shotguns, 0);
    },
    'no dice at turn start': function() {
      var t = new Turn();
      assert.length(t.dice, 0);
    },
    'three dice after roll': function() {
      var t = new Turn();
      t.roll();
      assert.length(t.dice, 3);
    }
};