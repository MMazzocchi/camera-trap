var ImageComparer = require("./ImageComparer.js");
var cv = require("opencv4nodejs");

var MOG2Comparer = function(threshold) {
  var that = new ImageComparer();

  // Fields
  var subtractor = new cv.BackgroundSubtractorMOG2(100, 16, true);

  that.handle = function(image_data) {
    that.log("Processing an image.");

    var buffer = Buffer.from(image_data, "base64");
    var mat = cv.imdecode(buffer, cv.IMREAD_COLOR);
    var gscale = mat.cvtColor(cv.COLOR_BGR2GRAY);
    var equalized = gscale.equalizeHist();

    var changed = subtractor.apply(equalized);

    var mean = changed.mean();
    var value = mean.w;
    that.log(value);

    return {
      "different": (value > threshold),
      "value": value,
      "mask": changed
    };
  };

  return that;
};

module.exports = MOG2Comparer;
