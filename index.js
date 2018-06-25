var CameraTrapServer = require("./server/CameraTrapServer.js");

const config = {
  "host": "0.0.0.0",
  "port": 9221,

  "mean_changed_threshold": 35,
  "blur_kernel_size": 5
};

new CameraTrapServer(config);
