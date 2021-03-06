// dependencies
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var socketio = require('socket.io')
var app = express();

// config for all environments
app.set('port', process.env.PORT || 3002);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// config for development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
};

//index route
app.get('/', routes.index);

// create/start the socket server
var server = http.createServer(app), io = socketio.listen(server);

// users object
var users = {};


// if the client just connected
io.sockets.on('connection', function(socket) {
  users[socket.id] = socket.id;
  io.sockets.emit('message', socket.id+' has joined the chatroom.');
  io.sockets.emit('users', users);

  socket.on('message', function(message){
  io.sockets.emit('message', {message: message, user: users[socket.id]});
  });

  socket.on('disconnect', function() {
    delete users[socket.id];
    io.sockets.emit('users', users);
    io.sockets.emit('disconnect', socket.id +' has left the chatroom.');
  });
  
});

server.listen(3002, function(){
console.log('Express server listening on port ' + app.get('port'));
});