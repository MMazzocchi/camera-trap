Video = async function() {
  var that = {};

  if((!navigator.mediaDevices) || (!navigator.mediaDevices.getUserMedia)) {
    throw new Error("Camera devices unsupported.");
  }

  // Fields
  var stream = await navigator.mediaDevices.getUserMedia({ video: true });

  // Public methods
  that.bind = function(video_el) {
    video_el.srcObject = stream;
    video_el.play();
  };

  return that;
};

module.exports = Video;
