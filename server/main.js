var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://doomnet-getnet-secure-doomnet.apps.us-east-2.starter.openshift-online.com:27017/";


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.createCollection("users", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
}); 

var usersOn={};


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
  console.log('Alguien se ha conectado con Sockets');

  usersOn[socket.id]={state:true,login:false,nick:"",id:socket.id};
  
  
  socket.on('new-message', function(data) {
    messages.push(data);

    io.sockets.emit('messages', messages);
  });
  
  io.on('link',(data)=>{
    usersOn[data.old].id=data.sockN;
    
  });
  
  
  io.on('newUser',(data)=>{
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var User = { name:data.name, password:data.password};
  dbo.collection("users").find(User).toArray(function(err, result) {
    if (err) throw err;
    if(result == null){
      var u = { name:data.name, password:data.password,friends:{},id:data.name+"#"+Math.floor(Math.random()*10)+""+Math.floor(Math.random()*10)};
        dbo.collection("users").insertOne(u, function(err, res) {
    if (err) throw err;
    console.log("User created!!");
     io.to(usersOn[data.socket]).emit('accept',true);
  });
       }else{
        io.to(usersOn[data.socket]).emit('accept',false);
       }
   
  });
    db.close();
  });
}); 
    
    
    
  });
  
  
  
  io.on('logIn',(data)=>{
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var User = {name:data.name,password:data.pass};
  dbo.collection("users").find(User).toArray(function(err, result) {
    if (err) throw err;
     if(result!=null){
        io.to(usersOn[data.socket]).emit('accept',true);
        usersOn[data.sock].login=true;
        }else{
        io.to(usersOn[data.socket]).emit('accept',false);
        }
  });
  db.close();
}); 
    
  });
  
  
  io.on('recMsg',(data)=>{
    io.to(usersOn[data.to]).emit('enterMsg',data.msg);
  });
  
io.on('addFriend',(data)=>{
  
});
  
io.on('settings',(data)=>{
  
});



server.listen(8080, function() {
  console.log("Servidor corriendo en http://0.0.0.0:8080");
});
