var $ = require("../lib/jquery-3.3.1.min.js");
var join = require("path").join;

var container = document.getElementById("image");

var files = $.getJSON("/pictures/")
.done(function(files) {
  var index = 0;
  var n = files.length;

  function loadImage() {
    var img = join("/picture", files[index]);
    container.src = img;
  };
  loadImage();

  function prev() {
    index = (index + files.length - 1) % files.length;
    loadImage();
  };
  document.getElementById("prev").onclick = prev;

  function next() {
    index = (index + 1) % files.length;
    loadImage();
  };
  document.getElementById("next").onclick = next;
});
