var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');

function initDb(){
  mongoose.connect('mongodb://172.30.212.254/doomnetDB3', {useNewUrlParser: true});
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log(">>Connected to mongo succefully.");

  
  });
}

var userSchema = new mongoose.Schema({name:String,password:String,friend:[String]});
var User = mongoose.model('User',userSchema);
console.log(User);

//Variables
let usersOn={};  //Diccionario con los sockets ip y nickname y varios datos.   name(String),login(bool),state(bool)
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

function searchKey(obj,value){
  return Object.keys(obj).find(key => obj[key]===value);
}

//Evento conecciones
io.on('connection', function(socket) {
  if(usersOn[socket]==null){
  console.log('Alguien se ha conectado con Sockets');
  console.log(usersOn);
  }
  socket.on("uIP",(data)=>{
    usersOn[socket]={ip:data.IP,nick:data.nick,sock:socket};
    console.log(usersOn[socket]);
    });
//Uso en local  
socket.on('new-message', function(data) {
    messages.push(data);

    io.sockets.emit('messages', messages);
});
//Uso en local
  
//Crear nuevo usuario  
socket.on("newUser",(data)=>{
  console.log("Creating user...");
  console.log(data);
    User.findOne({"name":data.name},"name",(err,user)=>{
      if (err){
       /* io.to(usersOn[data.ip]).emit('accept',{recv:false});
        console.log("Error creating user.");*/
        if(user ==null || user ==undefined){
        
          var usr = new User({name:data.name,password:data.password,friend:[]}).save(function(er){
            console.log(usr);
            if (er!=null){console.log(er);}else{
            console.log("New user:"+data.name);
            }
          });
     
          io.to(usersOn[data.ip]).emit('accept',{recv:true});
        
        }else{
          console.log("Error creating user.");
        }
      }
      
    });
});
  
  
//Log usuario
socket.on('logIn',(data)=>{
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
socket.on('sendMsg',(data)=>{

  io.to(searchKey(usersOn,data.to).sock).emit('recvMsg',{from:data.from,msg:data.msg});
  
});
  
//Añadir amigo  
socket.on('addFriend',(data)=>{
  User.findOne({"name":data.name},"name friend",(err,friends)=>{
    if (err){


      io.to(usersOn[data.ip]).emit('recvF',[]);

      return handleError(err);
    }
    if(friends!=null){

      io.to(usersOn[data.ip]).emit('recvF',{friends:friends});

    }
  });
});
 
//Acceder a settings
socket.on('settings',(data)=>{
  
    
});

//Pedir los amigos que tiene
socket.on('getFriends',(data)=>{
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

