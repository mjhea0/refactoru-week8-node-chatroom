// dependencies
var express = require('express');
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
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// create/start the socket server
var server = http.createServer(app), io = socketio.listen(server);

// users object
var users = {};

io.sockets.on('connection', function (socket) {

  socket.on('sendchat', function (data) {
    io.sockets.emit('updatechat', socket.username, data);
  });

  socket.on('adduser', function(username){
    socket.username = username;
    users[username] = username;
    socket.emit('updatechat', 'Server', 'you are connected, '+username);
    socket.broadcast.emit('updatechat', 'Server', username + ' has connected');
    io.sockets.emit('updateusers', users);
  });

  socket.on('disconnect', function(){
    delete users[socket.username];
    io.sockets.emit('updateusers', users);
    socket.broadcast.emit('updatechat', 'Server', socket.username + ' has disconnected');
  });
});

server.listen(3002, function(){
console.log('Express server listening on port ' + app.get('port'));
});












