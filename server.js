var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(8080, "0.0.0.0", function() {
  console.log("Server running @ http://" + "0.0.0.0" + ":" + 8080);
});
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', function (socket) {
	console.log("New connection!");
	socket.emit('message',"Hi :)");
  socket.emit('hello', { greeting: 'Hi socket ' + socket.id + ' this is Server speaking! Let\'s play ping-pong. You pass!' });
  socket.on('ping', function (data) { 
    console.log("received ping from client: ", data);
  });
});
