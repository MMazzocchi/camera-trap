var cluster = require("cluster");
var join = require("path").join;
var fs = require("fs");
var HistogramComparer = require("./HistogramComparer.js");
var debug = require("debug")("camera-trap:worker-"+process.pid);

if(cluster.isWorker) {
  debug("Started worker-"+process.pid);

  var id = process.pid;
  var comparer = new HistogramComparer(
    process.env.threshold0,
    process.env.threshold1, 
    process.env.threshold2,
    process.env.threshold3);

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
