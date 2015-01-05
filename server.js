// initialize everything, web server, socket.io, filesystem, johnny-five
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , five = require("johnny-five"),
  board,servo,led,sensor;

board = new five.Board();

// on board ready
board.on("ready", function() {

  // init a led on pin 13, strobe every 1000ms
  led = new five.Led(13).strobe(1000);

  // setup a stanard servo, center at start
  servo1 = new five.Servo({
    pin:6,
    range: [0,180],
    type: "standard",
    center:true
  });

  servo2 = new five.Servo({
    pin:7,
    range: [0,180],
    type: "standard",
    center:true
  });

  // poll this sensor every second
  sensor = new five.Sensor({
    pin: "A0",
    freq: 1000
  });

});

// make web server listen on port 80
app.listen(3000);


// handle web server
//function handler (req, res) {
//  fs.readFile(__dirname + '/index.html',
//
//  function (err, data) {
//    if (err) {
//      res.writeHead(500);
//      return res.end('Error loading index.html');
//    }
//
//    res.writeHead(200);
//    res.end(data);
//  });
//
//}


function handler(req, res) {
  if (req.url === '/') {
    fs.readFile('index.html', function(err, data){
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data, 'utf-8');
    });
  } else if (req.url === '/style.css') {
    fs.readFile('/style.css', function(err, data){
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.end(data, 'utf-8');
    });
    /*Read /css/custom.css file*/
  }
  else if (req.url === '/style.css') {
    fs.readFile('/style.css', function(err, data){
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.end(data, 'utf-8');
    });
    /*Read /css/custom.css file*/
  }else if (req.url === '/script.js') {
    fs.readFile('/script.js', function(err, data){
      res.writeHead(200, {'Content-Type': 'text/javascript'});
      res.end(data, 'utf-8');
    });
    /*Read /path/to/other.file*/
  }
}


// on a socket connection
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
 
  // if board is ready
  if(board.isReady){
    // read in sensor data, pass to browser
    sensor.on("data",function(){
      socket.emit('sensor', { raw: this.raw });
    });
  }

  // if servo1 message received
  socket.on('servo1', function (data) {
    console.log(data);
    if(board.isReady){ servo1.to(data.pos);  }
  });
  // if servo2 message received
  socket.on('servo2', function (data) {
    console.log(data);
    if(board.isReady){ servo2.to(data.pos);  }
  });
  // if led message received
  socket.on('led', function (data) {
    console.log(data);
     if(board.isReady){    led.strobe(data.delay); } 
  });

});