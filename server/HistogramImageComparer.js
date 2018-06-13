var ImageComparer = require("./ImageComparer.js");
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

var HistogramImageComparer = function(
  threshold0, threshold1, threshold2, threshold3) {

  var that = new ImageComparer();

  // Fields
  var base_hist = undefined;

  // Public methods
  that.handle = function(image_data) {
    that.log("Processing an image.");

    var buffer = Buffer.from(image_data, "base64");
    var mat = cv.imdecode(buffer, cv.IMREAD_COLOR);
    var hsv = mat.cvtColor(cv.COLOR_BGR2HSV);
    var hist = cv.calcHist(hsv, PARAMS).convertTo(cv.CV_32F);
    hist.normalize(0, 1, cv.NORM_MINMAX);

    if(base_hist === undefined) {
      base_hist = hist;
    }

    var metric0 = base_hist.compareHist(hist, 0);
    var metric1 = base_hist.compareHist(hist, 1);
    var metric2 = base_hist.compareHist(hist, 2);
    var metric3 = base_hist.compareHist(hist, 3);
    base_hist = hist;
    that.log("Completed image processing.");

    var diff = false;
    if (metric0 < threshold0) { that.log("metric0: "+metric0); diff = true; }
    if (metric1 > threshold1) { that.log("metric1: "+metric1); diff = true; }
    if (metric2 < threshold2) { that.log("metric2: "+metric2); diff = true; }
    if (metric3 > threshold3) { that.log("metric3: "+metric3); diff = true; }

    return diff;
  };

  return that;
};

module.exports = HistogramImageComparer;
