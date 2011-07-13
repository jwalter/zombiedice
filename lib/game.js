var Backbone = require('backbone');
var Game = Backbone.Model.extend({
  initialize: function(options) {
    this.name = options.name;
  }
});

module.exports = Game;