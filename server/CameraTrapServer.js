var fs = require("fs");
var join = require("path").join;
var express = require("express");
var app = express();
var http = require("http").Server(app);
var WebSocket = require("ws");
var ImageComparer = require("./ImageComparer.js");

var debug = require("debug")("camera-trap");

const PING_INTERVAL = 30000;

var CameraTrapServer = function(config) {
  app.use("/", express.static(join(__dirname, "../client")));
  var wss = new WebSocket.Server({
    server: http
  });
  
  wss.on("connection", function(socket, req) {
    debug("Received a new connection from "+req.connection.remoteAddress);
  
    socket.alive = true;
    socket.on("pong", function() {
      socket.alive = true;
    });
  
    var comparer = new ImageComparer(config.threshold0, config.threshold1,
                                     config.threshold2, config.threshold3);
 
    function handleImage(img){
      var different = comparer.handle(img);
  
      if(different) {
        var filename = join(__dirname, "..", "..", "pics", Date.now()+".jpg");
        debug("Writing "+filename);
  
        var buffer = Buffer.from(img, "base64");
        fs.writeFile(filename, buffer,
          function(err) {
            if(err) {
              debug("Could not write file: "+err);
            }
          });
      }
    };
 
    socket.on("message", function(json) {
      var msg = JSON.parse(json);

      if(msg.type === "image") {
        handleImage(msg.data);

      } else if(msg.type === "ping") {
        socket.send("pong");

      } else {
        debug("Received an unknown message type: "+msg.type);
      }
    });
  });
  
  var ping_interval = setInterval(function() {
    wss.clients.forEach(function(socket) {
      if(socket.alive === false) {
        debug("Cleaning up a dead socket.");
        socket.terminate();
  
      } else {
        socket.alive = false;
        socket.ping();
      }
    });
  }, PING_INTERVAL);
  
  http.listen(config.port, config.host, function() {
    debug("Listening on "+config.host+":"+config.port);
  });
};

module.exports = CameraTrapServer;
