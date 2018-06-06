Video = async function() {
  var that = {};

  // Check for camera support
  if((!navigator.mediaDevices) || (!navigator.mediaDevices.getUserMedia)) {
    throw new Error("Camera devices unsupported.");
  }

  // Fields
  var streaming = false;
  var stream = await navigator.mediaDevices.getUserMedia({ video: true });

  // Public methods
  that.bind = function(video_el) {
    video_el.srcObject = stream;
    video_el.play();
  };

  that.start = function() {
    streaming = true;
  };

  that.stop = function() {
    streaming = false;
  };

  that.streaming = function() {
    return streaming;
  };

  return that;
};

module.exports = Video;
