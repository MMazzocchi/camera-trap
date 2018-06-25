var cluster = require("cluster");
var join = require("path").join;
var fs = require("fs");
var ImageComparer = require("./ImageComparer.js")
var debug = require("debug")("camera-trap:worker-"+process.pid);

var cv = require("opencv4nodejs");

if(cluster.isWorker) {
  debug("Started worker-"+process.pid);

  var id = process.pid;
  var comparer = new ImageComparer(process.env.mog2_threshold);

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
      cv.imwrite(join(__dirname, "..", "..", "pics",
        Date.now()+"_"+id+"_mask_"+result.value+".jpg"), result.mask);
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
