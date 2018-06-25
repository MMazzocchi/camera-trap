var CameraTrapServer = require("./server/CameraTrapServer.js");

const config = {
  "host": "0.0.0.0",
  "port": 9221,

  "mog2_threshold": 35
};

new CameraTrapServer(config);
