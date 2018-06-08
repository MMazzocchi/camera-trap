var join = require("path").join;
var express = require("express");
var app = express();
var http = require("http").Server(app);
var WebSocket = require("ws");

const PORT = 9221;
const WS_PORT = 9222;
const HOST = "0.0.0.0";

app.use("/", express.static(join(__dirname, "client")));
var wss = new WebSocket.Server({
  server: http
});

wss.on("connection", function(socket) {
  console.log("Got a connection!!!");
});

http.listen(PORT, HOST, function() {
  console.log("Listening on "+HOST+":"+PORT);
});
