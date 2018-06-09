var join = require("path").join;
var express = require("express");
var app = express();
var http = require("http").Server(app);
var WebSocket = require("ws");
var ImageComparer = require("./ImageComparer.js");

var debug = require("debug")("camera-trap");

const PORT = 9221;
const HOST = "0.0.0.0";

app.use("/", express.static(join(__dirname, "../client")));
var wss = new WebSocket.Server({
  server: http
});

wss.on("connection", function(socket) {
  var comparer = new ImageComparer();
  debug("Received a new connection.");

  socket.on("message", function(img) {
    var different = comparer.handle(img);

    if(different) {
      console.log("Got one!");
    }
  });
});

http.listen(PORT, HOST, function() {
  debug("Listening on "+HOST+":"+PORT);
});