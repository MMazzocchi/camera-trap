var Video = require("./Video.js");
var Timer = require("./Timer.js");

const INTERVAL = 1000;

var preview_el = document.getElementById("preview");

Video(preview_el)
.then(function(video) {

  // Setup a timer to take snaps every INTERVAL milliseconds
  var timer = new Timer(INTERVAL,
    function() {
      var img = video.snap();
      console.log("Got an image.");
    });

  // Start and stop the timer based on the button
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
})
.catch(function(e) {
  console.error("Could not instantiate video", e);
});
