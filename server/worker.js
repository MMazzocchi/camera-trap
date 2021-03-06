var join = require("path").join;
var fs = require("fs");
var ImageComparer = require("./ImageComparer.js")
var debug = require("debug")("camera-trap:worker-"+process.pid);

var cv = require("opencv4nodejs");

debug("Started worker-"+process.pid);

var id = process.pid;
var threshold = process.env.mean_changed_threshold;
var kernel_size = process.env.blur_kernel_size;
var comparer = new ImageComparer(threshold, kernel_size);

var queue = [];

function writeImage(img, title) {
  var filename = join(process.env.output_dir, title+".jpg");
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
