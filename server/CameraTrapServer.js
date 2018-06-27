var fs = require("fs");
var join = require("path").join;
var express = require("express");
var app = express();
var http = require("http").Server(app);
var WebSocket = require("ws");
var child_process = require("child_process");

var debug = require("debug")("camera-trap");

const PING_INTERVAL = 30000;

var CameraTrapServer = function(config) {
  var worker_path = join(__dirname, "worker.js");

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

    var worker = child_process.fork(worker_path, {"env": config});
    socket.worker = worker;

    socket.on("message", function(json) {
      var msg = JSON.parse(json);

      if(msg.type === "image") {
        socket.worker.send(msg.data);

      } else if(msg.type === "ping") {
        socket.send("pong");

      } else {
        debug("Received an unknown message type: "+msg.type);
      }
    });

    socket.on("close", function() {
      debug("Socket closed.");
      socket.worker.kill();
    });

    socket.on("error", function() {
      debug("Socket errored.");
      socket.worker.kill();
    });
  });
  
  var ping_interval = setInterval(function() {
    wss.clients.forEach(function(socket) {
      if(socket.alive === false) {
        debug("Cleaning up a dead socket.");
        socket.terminate();
        socket.worker.kill(); 
 
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
