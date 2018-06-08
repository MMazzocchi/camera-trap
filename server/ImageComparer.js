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
  var base_img = undefined;

  // Public methods
  that.handle = function(new_img) {
    debug("Handling an image.");

    if(base_img === undefined) {
      base_img = new_img;
    }

    // TODO: Magic
  };

  return that;
};

module.exports = ImageComparer;
