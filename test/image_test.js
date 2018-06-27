var assert = require("assert");
var fs = require("fs");
var join = require("path").join;
var ImageComparer = require("../server/ImageComparer.js");

const THRESHOLD = 35;
const KERNEL_SIZE = 5;
const IMAGE_DIR = join(__dirname, "images");

function loadFileBase64(path) {
  var data = fs.readFileSync(path);
  var buffer = Buffer.from(data);
  var base64 = buffer.toString("base64");

  return base64;
};

describe("Image Comparison", function() {
  var files = fs.readdirSync(IMAGE_DIR);
  var comparer = new ImageComparer(THRESHOLD, KERNEL_SIZE);

  describe("First images", function() {
    it("should be classified as the same", function() {
      for(var i=0; i<files.length - 1; i++) {
        var img = loadFileBase64(join(IMAGE_DIR, files[i]));
        var result = comparer.handle(img);
        assert.equal(result.different, false);
      }
    });
  });

  describe("Last image", function() {
    it("should be classified as different", function() {
      var img = loadFileBase64(join(IMAGE_DIR, files[files.length-1]));
      var result = comparer.handle(img);
      assert.equal(result.different, true);
    });
  });
});
