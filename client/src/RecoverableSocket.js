var Socket = require("./Socket.js");
var Timer = require("./Timer.js");
var EventEmitter = require("events");

const PING_INTERVAL = 30000;

var RecoverableSocket = async function() {
  var that = new EventEmitter();

  // Fields
  var socket = await Socket();
  var retries = 0;
  var pinger = new Timer(PING_INTERVAL, ping);

  // Private methods
  function handleClose() {
    that.emit("status", "Connection to server was closed.");
    socket.alive = false;
  };

  function handleError(e) {
    that.emit("status", "Connection to server errored: "+e);
    socket.alive = false;
  };

  function handleMessage(msg) {
    socket.alive = true;
  };

  function ping() {
   if(socket.alive === false) {
      setStatus("Attempting to reconnect...");

      Socket().then(function(new_socket) {
        socket.removeListeners();
        socket.close();

        socket = new_socket;
        setupSocket();
        that.emit("status", "");
      })
      .catch(function(e) {
        that.emit("status", "Reconnect #"+retries+" failed: "+e.message);
      });
    } else {
      socket.alive = false;
      var msg = { "type": "ping" };
      socket.send(JSON.stringify(msg));
    }
  };
 
  function setupSocket() { 
    socket.alive = true;

    socket.addEventListener("close", handleClose);
    socket.addEventListener("error", handleError);
    socket.addEventListener("message", handleMessage);

    socket.removeListeners = function() {
      socket.removeEventListener("close", handleClose);
      socket.removeEventListener("error", handleError);
      socket.removeEventListener("message", handleMessage);
    };
  };

  // Public methods
  that.send = function(msg) {
    socket.send(msg);
  };

  setupSocket();
  return that;
};

module.exports = RecoverableSocket;
