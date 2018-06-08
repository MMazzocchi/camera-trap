var ImageComparer = function() {
  var that = {};

  // Fields
  var base_img = undefined;

  // Public methods
  that.handle = function(new_img) {
    if(base_img === undefined) {
      base_img = new_img;
    }

    // TODO: Magic
  };

  return that;
};

module.exports = ImageComparer;
