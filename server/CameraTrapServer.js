var fs = require("fs");
var path = require("path");
var join = path.join;
var extname = path.extname;
var express = require("express");
var app = express();
var https = require("https");
var WebSocket = require("ws");
var child_process = require("child_process");

var debug = require("debug")("camera-trap");

const PING_INTERVAL = 30000;

var CameraTrapServer = function(config) {
  var https_options = {
    key: config.key ? fs.readFileSync(config.key) : undefined,
    cert: config.cert ? fs.readFileSync(config.cert) : undefined,
    ca: config.ca ? fs.readFileSync(config.ca) : undefined
  };
  var server = https.createServer(https_options, app);

  var worker_path = join(__dirname, "worker.js");

  app.use("/", express.static(join(__dirname, "..", "client")));
  app.use("/slideshow",
    express.static(join(__dirname, "..", "client", "slideshow.html")));
  app.use("/picture", express.static(config.output_dir));

  app.get("/pictures", function(req, res) {
    var files = fs.readdirSync(config.output_dir);
    var pics = files.filter(function(file) {
      return (extname(file) === ".jpg");
    });

    res.send(JSON.stringify(pics));
  });

  var wss = new WebSocket.Server({
    server: server 
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

        if(!socket.worker.exitedAfterDisconnect) {
          socket.worker.kill(); 
        }
 
      } else {
        socket.alive = false;
        socket.ping();
      }
    });
  }, PING_INTERVAL);
  
  server.listen(config.port, config.host, function() {
    debug("Listening on "+config.host+":"+config.port);
  });
};

module.exports = CameraTrapServer;
