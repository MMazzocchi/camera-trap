var HistogramComparer = require("./HistogramComparer.js");
var MOG2Comparer = require("./MOG2Comparer.js");

var ComparerFactory = {};
ComparerFactory.create = function() {
  var type = process.env.comparer_type;

  if(type === "histogram") {
    return new HistogramComparer(
      process.env.threshold0,
      process.env.threshold1,
      process.env.threshold2,
      process.env.threshold3);

  } else if(type === "mog2") {
    return new MOG2Comparer();

  } else {
    throw new Error("Comparer type "+type+" was not recognized.");
  }
};

module.exports = ComparerFactory;
