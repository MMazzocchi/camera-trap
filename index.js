var CameraTrapServer = require("./server/CameraTrapServer.js");
var join = require("path").join;

const config = {
  "host": "0.0.0.0",
  "port": 9221,

  "mean_changed_threshold": 35,
  "blur_kernel_size": 5,
  "output_dir": join(__dirname, "..", "pics")
};

new CameraTrapServer(config);
