Video = async function(video_el) {
  var that = {};

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

  // Public methods
  that.snap = function() {
    ctx.drawImage(video_el, 0, 0, canvas.width, canvas.height);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  };

  return that;
};

module.exports = Video;
