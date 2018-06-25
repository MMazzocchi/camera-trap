var ImageComparer = require("./ImageComparer.js");

var ComparerFactory = {};
ComparerFactory.create = function() {
  return new ImageComparer(process.env.mog2_threshold);
};

module.exports = ComparerFactory;
