var Backbone = require('backbone');
var uuid = require('node-uuid');

var Player = Backbone.Model.extend({
  initialize: function(options) {
    var score = options.score;
    if (!score) {
      score = 0;
    }
    this.score = score;
    this.name = options.name;
    var id = options.id;
    if (!id) {
      id = uuid();
    }
    this.id = id;
    this.set({id: id});
    this.pid = options.pid;
  },
  toJSON: function() {
    return {name: this.name,
      id: this.id,
      score: this.score}
  }
});

module.exports = Player;