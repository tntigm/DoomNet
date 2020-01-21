var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);




//Variables
var usersOn={};  //Diccionario con los sockets ip y nickname y varios datos.   name(String),ip(String),login(bool),state(bool)
//Variables



//CORS header
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
//CORS header

app.use(express.static('public'));
app.get('/hello', function(req, res) {
  res.status(200).send("Hello World!");
});



//Evento conecciones
io.on('connection', function(socket) {
  console.log('Alguien se ha conectado con Sockets');

//Uso en local  
  socket.on('new-message', function(data) {
    messages.push(data);

    io.sockets.emit('messages', messages);
});
//Uso en local

//Linkear sockets    
io.on('link',(data)=>{
    
      
});
  
//Crear nuevo usuario  
io.on('newUser',(data)=>{
    
    
    
});
  
  
//Log usuario
io.on('logIn',(data)=>{

    
});
  
//Reenviar mensaje  
io.on('recMsg',(data)=>{

  
});
  
//Añadir amigo  
io.on('addFriend',(data)=>{
  
    
});
 
//Acceder a settings
io.on('settings',(data)=>{
  
    
});
});

//Iniciar mongoDB
initDb(function(err){
console.log("Error:"+err);
});

//Escuchar socket
server.listen(8080, function() {
  console.log("Servidor corriendo en http://0.0.0.0:8080");
});

