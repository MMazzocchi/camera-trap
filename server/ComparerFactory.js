var MOG2Comparer = require("./MOG2Comparer.js");

var ComparerFactory = {};
ComparerFactory.create = function() {
  return new MOG2Comparer(process.env.mog2_threshold);
};

module.exports = ComparerFactory;
