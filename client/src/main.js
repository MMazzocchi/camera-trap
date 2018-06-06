var Video = require("./Video.js");

var preview_el = document.getElementById("preview");

Video()
.then(function(video) {;
  video.bind(preview_el);
})
.catch(function(e) {
  console.error("Could not instantiate video", e);
});
