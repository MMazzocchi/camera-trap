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

  // Public methods
  that.log = debug;

  that.handle = function(image_data) {
    throw new Error("ImageComparer.handle should be overriden by derived "+
      "classes.");
  };

  return that;
};

module.exports = ImageComparer;
