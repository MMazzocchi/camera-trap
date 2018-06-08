Video = async function() {
  var that = {};

  // Check for camera support
  if((!navigator.mediaDevices) || (!navigator.mediaDevices.getUserMedia)) {
    throw new Error("Camera devices unsupported.");
  }

  // Fields
  var stream = await navigator.mediaDevices.getUserMedia({ video: true });
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext('2d');

  // Public methods
  that.bind = function(video_el) {
    video_el.srcObject = stream;
    video_el.play();

    canvas.width = video_el.offsetWidth;
    canvas.height = video_el.offsetHeight;
  };

  that.snap = function() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return ctx.getImageData(0, 0, canvas.width, canvas.width);
  };

  return that;
};

module.exports = Video;
