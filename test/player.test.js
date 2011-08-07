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
    },
    'JSON should contain correct name': function() {
      var name = 'testname';
      var p = new Player({name: name});
      assert.equal(p.toJSON().name, name);
    },
    'JSON should contain correct score': function() {
      var score = 15;
      var p = new Player({score: score});
      assert.equal(p.toJSON().score, score);
    }
};