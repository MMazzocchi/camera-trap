var CameraTrapServer = require("./server/CameraTrapServer.js");
var join = require("path").join;

const config = {
  "host": "0.0.0.0",
  "port": 9221,
  "key": join(__dirname, "..", "certs", "private.key"),
  "cert": join(__dirname, "..", "certs", "cameratrap.crt"),
  "ca": undefined,

  "mean_changed_threshold": 35,
  "blur_kernel_size": 5,
  "output_dir": join(__dirname, "..", "pics")
};

new CameraTrapServer(config);
