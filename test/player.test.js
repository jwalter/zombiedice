var assert = require('assert'),
  Player = require('../lib/player.js');
 
module.exports = {
    'players should have unique ids': function() {
      var p1 = new Player({ name: 'one'});
      var p2 = new Player({ name: 'two'});
      assert.notEqual(p1.id, p2.id);
    },
    'player id should be re-used if present in parameters': function() {
      var id = '123456';
      var p = new Player({id: id});
      assert.equal(p.id, id);
    }
};