var Video = require("./Video.js");
var RecoverableSocket = require("./RecoverableSocket.js");
var Timer = require("./Timer.js");
var fullscreen = require("./fullscreen.js");

const INTERVAL = 1000;

// Setup the menu
var menu = document.getElementById("menu");
var menu_btn = document.getElementById("menu-button");
menu_btn.onclick = function(e) {
  e.preventDefault();
  menu.style.display = "block";
};

var close_btn = document.getElementById("close-button");
close_btn.onclick = function(e) {
  e.preventDefault();
  menu.style.display = "none";
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
Promise.all([RecoverableSocket(), Video(preview_el)]).then(function(values) {
  var socket = values[0];
  var video = values[1];

  socket.on("status", setStatus);

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
})
.catch(function(e) {
  setStatus("An error occured: "+e.message);
});
