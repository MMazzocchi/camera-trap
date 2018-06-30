var wait = require("./wait.js");

Video = async function(video_el) {
  var that = {};

  // Fields
  var zoom_available = false;
  var min_zoom = undefined;
  var zoom_range = undefined;
  var zoom_step = undefined;

  // Check for camera support
  if((!navigator.mediaDevices) || (!navigator.mediaDevices.getUserMedia)) {
    throw new Error("Camera devices unsupported.");
  }

  // Setup the stream
  var stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video_el.srcObject = stream;
  video_el.play();

  // Setup the canvas
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = video_el.offsetWidth;
    canvas.height = video_el.offsetHeight;
  };
  resize();
  window.addEventListener("resize", resize); 

  // Setup zoom. For some reason, zoom isn't always immediately available, so
  // wait one second before checking.
  await wait(1000);
  var track = stream.getVideoTracks()[0];
  if(track.getCapabilities) {
    var caps = track.getCapabilities();
    if(caps.zoom) {
      zoom_available = true;

      min_zoom = caps.zoom.min;
      zoom_range = caps.zoom.max - caps.zoom.min;
      zoom_step = caps.zoom.step;
    }
  }

  // Public methods
  that.snap = function() {
    ctx.drawImage(video_el, 0, 0, canvas.width, canvas.height);
    var url = canvas.toDataURL("image/jpg");
    var base64 = url.replace(/^data:image\/(jpg|png);base64,/, "")
    return base64;
  };

  that.setZoom = function(value) {
    if(zoom_available) {
      console.log(min_zoom);
      console.log(zoom_range);
      console.log(zoom_step);
      var range_value = Math.floor(value*zoom_range);
      range_value -= range_value % zoom_step;
      var zoom_value = min_zoom + range_value;
      track.applyConstraints({ advanced: [{ zoom: zoom_value }]});
    }
  };

  that.zoomAvailable = function() {
    return zoom_available;
  };

  return that;
};

module.exports = Video;
