var Backbone = require('backbone');
var uuid = require('node-uuid');

var Player = Backbone.Model.extend({
  initialize: function(options) {
    this.name = options.name;
    var id = options.id;
    if (!id) {
      id = uuid();
    }
    this.id = id;
    this.set({id: id});
    this.pid = options.pid;
  }
});

module.exports = Player;