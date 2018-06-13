var ImageComparer = require("./ImageComparer.js");

var MOG2Comparer = function() {
  var that = new ImageComparer();

  that.handle = function(img_data) {
    return false;
  };

  return that;
};

module.exports = MOG2Comparer;
