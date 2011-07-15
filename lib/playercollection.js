var Player = require('./player.js');
var Backbone = require('backbone');

var PlayerCollection = Backbone.Collection.extend({
  model: Player
});

module.exports = PlayerCollection;