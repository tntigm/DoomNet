var express = require('express');
var app = require('express')();
var server = require('http').Server(app);

var ip = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || 'testw3-doomnet.apps.us-east-2.starter.openshift-online.com';
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

server.listen(port, ip, function() {
  console.log("Server running @ http://" + ip + ":" + port);
});
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
var io = require('socket.io')(server);
io.on('connection', function (socket) {
	console.log("New connection!");
  socket.emit('hello', { greeting: 'Hi socket ' + socket.id + ' this is Server speaking! Let\'s play ping-pong. You pass!' });
  socket.on('ping', function (data) { 
    console.log("received ping from client: ", data);
  });
});
