/**
 * Module dependencies.
 */

var express = require('express');
require('jade');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var users = [
  { id: 0, role: 'admin', name: 'Joakim', email: 'joakim.waltersson@gmail.com' }
  , { id: 1, role: 'guest', name: 'Edvin', email: 'edvin@waltersson.com'}
];

var User = {
  find: function(id, fn) {
    fn(null, users[id]);
  },

  all: function(fn) {
    fn(null, users);
  }
};
// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.get('/user/:id', function(req, res, next){
  console.log('Show user');
  User.find(req.params.id, function(err, user){
    if (!user) return next(new Error('failed to load user'));
    res.render('users/show', { user: user, title: user.name });
  })
});

app.get('/user/:id/edit', function(req, res, next){
  User.find(req.params.id, function(err, user){
    if (!user) return next(new Error('failed to load user'));
    res.render('users/edit', { user: user });
  })
});

app.get('/users', function(req, res) {
  res.render('users', { users: users, title: 'Users' });
});

app.listen(8080);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
