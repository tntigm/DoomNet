var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var userOn={};

io.origins(['https://sites.google.com/view/doomnet/userreg']);
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.use(express.static('public'));

app.get('/hello', function(req, res) {
  res.status(200).send("Hello World!");
});

io.on('connection', function(socket) {
  console.log('New connection');
 /* socket.on('new-message', function(data) {
    messages.push(data);

    io.sockets.emit('messages', messages);
  });*/
  
  socket.on('new-user',(data)=>{
    console.log(data);
  });
  socket.on('log-user',(data)=>{
    
  });
  socket.on('send-msg',(data)=>{
    
  });
});

server.listen(8080, function() {
  console.log("Servidor corriendo en http://0.0.0.0:8080");
});
