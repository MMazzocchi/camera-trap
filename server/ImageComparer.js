var cv = require("opencv4nodejs");

var start_id = 0;
function newId() {
  var new_id = start_id;
  start_id += 1;
  return new_id;
};

const BLUR_KERNEL = new cv.Size(5, 5);

var ImageComparer = function(threshold) {
  var that = {};

  // Fields
  var id = newId();
  var debug = require("debug")("camera-trap:comparer:"+id);
  var subtractor = new cv.BackgroundSubtractorMOG2(100, 16, true);

  that.handle = function(image_data) {
    debug("Processing an image.");

    var buffer = Buffer.from(image_data, "base64");
    var mat = cv.imdecode(buffer, cv.IMREAD_COLOR);
    var gscale = mat.cvtColor(cv.COLOR_BGR2GRAY);
    var blurred = gscale.blur(BLUR_KERNEL);
    var equalized = blurred.equalizeHist();

    var changed = subtractor.apply(equalized);

    var mean = changed.mean();
    var value = mean.w;
    debug(value);

    return {
      "different": (value > threshold),
      "value": value,
      "mask": changed
    };
  };

  return that;
};

module.exports = ImageComparer;
