var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var MongoClient = require('mongodb').MongoClient;

var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL||"mongodb://doomnet-getnet-secure-doomnet.apps.us-east-2.starter.openshift-online.com:27017/",
    mongoURLLabel = "";

var mongodb = require('mongodb');
mongoDatabase = process.env.database_name;
mongoPassword = process.env.password;
mongoUser = process.env.username;   
var url = "mongodb://0.0.0.0:27017/";
var initDb = function(callback) {
  if (mongoURL == null){callback("URL igual a null//Mongo");return;}

  var mongodb = require('mongodb');
  if (mongodb == null){callback("Problemas cargando el package//Mongo");return;}
  
  
  var mongoHost, mongoPort, mongoDatabase, mongoPassword, mongoUser;

    mongoDatabase = "mydb";
    mongoPassword = "tntomg999";
    mongoUser = "tntigm";
    var mongoUriParts = url.split("//");
    if (mongoUriParts.length == 2) {
      mongoUriParts = mongoUriParts[1].split(":");
      if (mongoUriParts && mongoUriParts.length == 2) {
        mongoHost = mongoUriParts[0];
        mongoPort = mongoUriParts[1];
      }
    }
  
  
  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
  }
 
  
var db = null,
    dbDetails = new Object();
  
  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};



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
   if (!db) {
    initDb(function(err){});
  }
  res.status(200).send("Hello World!");
});

io.on('connection', function(socket) {
  console.log('Alguien se ha conectado con Sockets');
if(usersOn){
  usersOn[socket.id]={state:true,login:false,nick:"",id:socket.id};
   }
  
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

initDb(function(err){
console.log("Error:"+err);
});

server.listen(8080, function() {
  console.log("Servidor corriendo en http://0.0.0.0:8080");
});
