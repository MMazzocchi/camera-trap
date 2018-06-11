var cluster = require("cluster");
var join = require("path").join;
var fs = require("fs");
var ImageComparer = require("./ImageComparer.js");
var debug = require("debug")("camera-trap:worker-"+process.pid);

if(cluster.isWorker) {
  debug("Started worker-"+process.pid);

  var id = process.pid;
  var comparer = new ImageComparer(process.env.threshold0,
    process.env.threshold1, process.env.threshold2, process.env.threshold3);
 
  function handleImage(img){
    var different = comparer.handle(img);
  
    if(different) {
      var filename = join(__dirname, "..", "..", "pics",
        Date.now()+"_"+id+".jpg");
      debug("Writing "+filename);
  
      var buffer = Buffer.from(img, "base64");
      fs.writeFile(filename, buffer,
        function(err) {
          if(err) {
            debug("Could not write file: "+err);
          }
        });
    }
  };

  process.on("message", handleImage);
 
} else {
  console.log("ERROR: worker.js must be run as a Worker process.");
}
