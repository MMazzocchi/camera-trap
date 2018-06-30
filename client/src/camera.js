var Video = require("./Video.js");
var Socket = require("./Socket.js");
var Timer = require("./Timer.js");
var fullscreen = require("./fullscreen.js");

const INTERVAL = 1000;
const PING_INTERVAL = 30000;

// Bind events to a new socket
function setupSocket(socket) {
  function handleClose() {
    setStatus("Connection to server was closed.");
    socket.alive = false;
  };
  socket.addEventListener("close", handleClose);

  function handleError(e) {
    setStatus("Connection to server errored: "+e);
    socket.alive = false;
  };
  socket.addEventListener("error", handleError);

  socket.alive = true;
  function handleMessage(msg) {
    socket.alive = true;
  };
  socket.addEventListener("message", handleMessage);

  socket.removeListeners = function() {
    socket.removeEventListener("close", handleClose);
    socket.removeEventListener("error", handleError);
    socket.removeEventListener("message", handleMessage);
  };
};

// Attach a timer to the button
function attachButton(timer) {
  var button = document.getElementById("button");
  var inner = document.getElementById("inner-button");

  button.onclick = function(e) {
    e.preventDefault();

    if(timer.running()) {
      inner.setAttribute("fill", "grey");
      timer.stop();

    } else {
      inner.setAttribute("fill", "red");
      timer.start();
    }
  };
};

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

// Setup the preview
var preview_el = document.getElementById("preview");
Promise.all([Socket(), Video(preview_el)]).then(function(values) {
  var socket = values[0];
  var video = values[1];

  setupSocket(socket);

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
  attachButton(timer);

  // Setup ping
  var retries = 0;

  var pinger = new Timer(PING_INTERVAL, function() {
    if(socket.alive === false) {
      setStatus("Attempting to reconnect...");

      Socket().then(function(new_socket) {
        socket.removeListeners();
        socket.close();

        socket = new_socket;
        setupSocket(socket);
        setStatus("");
      })
      .catch(function(e) {
        setStatus("Reconnect #"+retries+" failed: "+e.message);
      });
    } else {
      socket.alive = false;
      var msg = { "type": "ping" };
      socket.send(JSON.stringify(msg));
    }
  });
  pinger.start();
})
.catch(function(e) {
  setStatus("An error occured: "+e.message);
});