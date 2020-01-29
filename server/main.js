var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');

function initDb(){
  mongoose.connect('mongodb://172.30.212.254/doomnetDB', {useNewUrlParser: true});
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log(">>Connected to mongo succefully.");

    var userSchema = new mongoose.Schema({name:String,password:String,friend:[{name:String}],state:Boolean});
    var userComp = mongoose.model('User',userSchema);
  });
}




//Variables
var usersOn={};  //Diccionario con los sockets ip y nickname y varios datos.   name(String),login(bool),state(bool)
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

  if(usersOn[socket.request.connection.remoteAddress]==null){
  usersOn[socket.request.connection.remoteAddress]={name:"",state:false};
  }

//Uso en local  
  socket.on('new-message', function(data) {
    messages.push(data);

    io.sockets.emit('messages', messages);
});
//Uso en local

  
//Crear nuevo usuario  
io.on('newUser',(data)=>{
    User.findOne({"name":data.name},"name",(err,user)=>{
      if (err){

        io.to(usersOn[data.ip]).emit('accept',false);

        return handleError(err);
      }
      if(user!=null){
        var usr = new User({name:user.name,password:user.pass,friend:[],state:true}).save((err)=>{
          if (err) throw err;
          console.log("New user:"+user.name);
        });
   
        io.to(usersOn[data.ip]).emit('accept',true);
      }
    });
    

    
});
  
  
//Log usuario
io.on('logIn',(data)=>{
  User.findOne({"name":data.name},"name",(err,user)=>{
    if (err){

      io.to(usersOn[data.ip]).emit('accept',false);

      return handleError(err);
    }
    if(user!=null){

      console.log("Log In:"+user.name);
      usersOn[data.ip].name = user.name;
      usersOn[data,ip].state = true;
      io.to(usersOn[data.ip]).emit('accept',true);

    }
  });
    
});
  
//Reenviar mensaje  
io.on('sendMsg',(data)=>{

  io.to(usersOn[data.to]).emit('recvMsg',{from:data.from,msg:data.msg});
  
});
  
//Añadir amigo  
io.on('addFriend',(data)=>{
  User.findOne({"name":data.name},"name friend",(err,friends)=>{
    if (err){


      io.to(usersOn[data.ip]).emit('recvF',[]);

      return handleError(err);
    }
    if(friends!=null){

      io.to(usersOn[data.ip]).emit('recvF',friends);

    }
  });
});
 
//Acceder a settings
io.on('settings',(data)=>{
  
    
});

//Pedir los amigos que tiene
io.on('getFriends',(data)=>{
  User.findOne({"name":data.name},"name friend",(err,friends)=>{
    if (err){

      io.to(usersOn[data.ip]).emit('recvF',[]);

      return handleError(err);
    }
    if(friends!=null){

      io.to(usersOn[data.ip]).emit('recvF',friends);

    }
  });
}
);
});

//Iniciar mongoDB
initDb(function(err){
console.log("Error:"+err);
});

//Escuchar socket
server.listen(8080, function() {
  console.log("Servidor corriendo en http://0.0.0.0:8080");
});
