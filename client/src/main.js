var Video = require("./Video.js");
var Socket = require("./Socket.js");
var Timer = require("./Timer.js");
var fullscreen = require("./fullscreen.js");
var NoSleep = require("../lib/NoSleep.min.js");

const INTERVAL = 1000;

// Setup error display
var error_box = document.getElementById("error-box");
function addError(text) {
  error_box.innerHTML += `<p>${text}</p>`;
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
      socket.send(JSON.stringify(img));
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
    addError("Connection to server was closed.");
  };

  socket.onerror = function(e) {
    addError("Connection to server errored: "+e);
  };
})
.catch(function(e) {
  addError("An error occured: "+e.message);
});
