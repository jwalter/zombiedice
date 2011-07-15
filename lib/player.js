var Backbone = require('backbone');

var Player = Backbone.Model.extend({
  initialize: function(options) {
    this.name = options.name;
  }
});

module.exports = Player;