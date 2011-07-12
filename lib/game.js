var Backbone = require('backbone');
var Game = Backbone.Model.extend({
  name: function() { return 'name of the game'; }
});

module.exports = Game;