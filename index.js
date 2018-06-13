var CameraTrapServer = require("./server/CameraTrapServer.js");

const config = {
  "host": "0.0.0.0",
  "port": 9221,

  "comparer_type": "mog2",

  // Histogram comparer configuration
  "threshold0": 0.998,
  "threshold1": 50000,
  "threshold2": 2,
  "threshold3": 0.15
};

new CameraTrapServer(config);
