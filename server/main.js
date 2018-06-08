var join = require("path").join;
var express = require("express");
var app = express();
var http = require("http").Server(app);
var WebSocket = require("ws");
var ImageComparer = require("./ImageComparer.js");

const PORT = 9221;
const HOST = "0.0.0.0";

app.use("/", express.static(join(__dirname, "../client")));
var wss = new WebSocket.Server({
  server: http
});

wss.on("connection", function(socket) {
  var comparer = new ImageComparer();

  socket.on("message", function(img) {
    comparer.handle(img);
  });
});

http.listen(PORT, HOST, function() {
  console.log("Listening on "+HOST+":"+PORT);
});
