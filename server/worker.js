var cluster = require("cluster");
var join = require("path").join;
var fs = require("fs");
var ComparerFactory = require("./ComparerFactory.js");
var debug = require("debug")("camera-trap:worker-"+process.pid);

if(cluster.isWorker) {
  debug("Started worker-"+process.pid);

  var id = process.pid;
  var comparer = ComparerFactory.create();

  var queue = [];
  var dir = join(__dirname, "..", "..", "pics");

  function writeImage(img, title) {
    var filename = join(dir, title+".jpg");
    debug("Writing "+filename);
  
    var buffer = Buffer.from(img, "base64");
    fs.writeFile(filename, buffer,
      function(err) {
        if(err) {
          debug("Could not write file: "+err);
        }
      });
  };

  function handleImage(img){
    var result = comparer.handle(img);
  
    if(result.different) {
      writeImage(img, Date.now()+"_"+id);
    }
  };

  function readQueue() {
    if(queue.length > 0) {
      handleImage(queue.shift());
    }

    setImmediate(readQueue);
  };

  process.on("message", function(img) {
    queue.push(img);
  });

  setImmediate(readQueue);

} else {
  console.log("ERROR: worker.js must be run as a Worker process.");
}
