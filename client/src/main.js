var Video = require("./Video.js");
var Socket = require("./Socket.js");
var Timer = require("./Timer.js");
var fullscreen = require("./fullscreen.js");
var NoSleep = require("../lib/NoSleep.min.js");

const INTERVAL = 1000;
const PING_INTERVAL = 30000;

// Setup status display
var status_box = document.getElementById("status-box");
function setStatus(text) {
  if(text.length > 0) {
    status_box.innerHTML = `<p>${text}</p>`;
  } else {
    status_box.innerHTML = "";
  }
};

// Allow for fullscreen
var body = document.getElementsByTagName("body")[0];
fullscreen(body);

var nosleep = new NoSleep();

var preview_el = document.getElementById("preview");
Promise.all([Socket(), Video(preview_el)]).then(function(values) {
  var socket = values[0];
  var video = values[1];

  // Setup a timer to take snaps every INTERVAL milliseconds
  var timer = new Timer(INTERVAL,
    function() {
      var img = video.snap();
      var msg = {
        "type": "image",
        "data": img
      };

      socket.send(JSON.stringify(msg));
    });

  // Start and stop the timer based on the button
  var button = document.getElementById("button");
  var inner = document.getElementById("inner-button");
  button.onclick = function(e) {
    e.preventDefault();

    if(timer.running()) {
      inner.setAttribute("fill", "grey");
      timer.stop();
      nosleep.disable();

    } else {
      inner.setAttribute("fill", "red");
      timer.start();
      nosleep.enable();
    }
  };

  // Show error on disconnect
  socket.onclose = function() {
    setStatus("Connection to server was closed.");
  };

  socket.onerror = function(e) {
    setStatus("Connection to server errored: "+e);
  };

  // Setup ping
  socket.alive = true;
  socket.addEventListener("message", function(msg) {
    socket.alive = true;
  });

  var ping_interval = setInterval(function() {
    if(socket.alive === false) {
      setStatus("Lost connection to server. Attempting to reconnect...");
      Socket().then(function(new_socket) {
        new_socket.alive = true;
        socket = new_socket;
        setStatus("");
      })
      .catch(function(e) {
        setStatus("Reconnect failed: "+e);
        clearInterval(ping_interval);
      });

    } else {
      socket.alive = false;
      var msg = { "type": "ping" };
      socket.send(JSON.stringify(msg));
    }
  }, PING_INTERVAL);
})
.catch(function(e) {
  setStatus("An error occured: "+e.message);
});
