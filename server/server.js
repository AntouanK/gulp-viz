
var http        = require('http'),
    fs          = require('fs'),
    path        = require('path'),
    express     = require('express'),
    app         = express(),
    morgan      = require('morgan'),
    compression = require('compression'),
    deployPath  = __dirname + '/../deploy';

var server = require('http').Server(app);
var io = require('socket.io')(server);
io.on('connection', function(socket){
  socket.on('event', function(data){});
  socket.on('disconnect', function(){});
});


app.use( morgan({ format: 'dev' }) );

//  gzip compression
app.use(compression());

app.use(function(req,res,next){

  //  do something

  next();
});

app.use(express.static(deployPath));
console.log('deployPath : ', deployPath);

app.listen(80);
