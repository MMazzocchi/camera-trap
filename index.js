const config = {
  "host": "0.0.0.0",
  "port": 9221,

  "threshold0": 0.998,
  "threshold1": 44000,
  "threshold2": 2,
  "threshold3": 0.15
};

var main = require("./server/main.js");
main(config);
