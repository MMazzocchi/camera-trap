var cv = require("opencv4nodejs");

const PARAMS = [
  // HUE
  {
    "channel": 0,
    "ranges": [0, 180],
    "bins": 50
  },

  // SATURATION
  {
    "channel": 1,
    "ranges": [0, 256],
    "bins": 60
  }
];

var start_id = 0;
function newId() {
  var new_id = start_id;
  start_id += 1;
  return new_id;
};

var ImageComparer = function() {
  var that = {};

  // Fields
  var id = newId();
  var debug = require("debug")("camera-trap:comparer:"+id);
  var base_hist = undefined;

  // Public methods
  that.handle = function(image_data) {
    debug("Processing an image.");

    var buffer = Buffer.from(image_data, "base64");
    var mat = cv.imdecode(buffer, cv.IMREAD_COLOR);
    var hsv = mat.cvtColor(cv.COLOR_BGR2HSV);
    var hist = cv.calcHist(hsv, PARAMS).convertTo(cv.CV_32F);
    hist.normalize(0, 1, cv.NORM_MINMAX);

    if(base_hist === undefined) {
      base_hist = hist;

    } else {
      var metric = base_hist.compareHist(hist, 0);
      console.log(metric);
    }

    debug("Completed image processing.");
  };

  return that;
};

module.exports = ImageComparer;
