var Backbone = require('backbone');
var Player = Backbone.Model.extend({
  initialize: function(options) {
    this.name = options.name;
    this.pid = options.pid;
  }
});

module.exports = Player;