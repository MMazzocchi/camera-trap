var cluster = require("cluster");
var join = require("path").join;
var fs = require("fs");
var MOG2Comparer = require("./MOG2Comparer.js");
var debug = require("debug")("camera-trap:worker-"+process.pid);

if(cluster.isWorker) {
  debug("Started worker-"+process.pid);

  var id = process.pid;
  var comparer = new MOG2Comparer();

  var queue = [];
  var dir = join(__dirname, "..", "..", "pics");

  function writeImage(img) {
    var filename = join(dir, Date.now()+"_"+id+".jpg");
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
    var different = comparer.handle(img);
  
    if(different) {
      writeImage(img);
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
