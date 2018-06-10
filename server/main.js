var fs = require("fs");
var join = require("path").join;
var express = require("express");
var app = express();
var http = require("http").Server(app);
var WebSocket = require("ws");
var ImageComparer = require("./ImageComparer.js");

var debug = require("debug")("camera-trap");

const PORT = 9221;
const HOST = "0.0.0.0";
const PING_INTERVAL = 30000;

app.use("/", express.static(join(__dirname, "../client")));
var wss = new WebSocket.Server({
  server: http
});

wss.on("connection", function(socket) {
  debug("Received a new connection.");

  socket.alive = true;
  socket.on("pong", function() {
    socket.alive = true;
  });

  var comparer = new ImageComparer();

  socket.on("message", function(img) {
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

http.listen(PORT, HOST, function() {
  debug("Listening on "+HOST+":"+PORT);
});
