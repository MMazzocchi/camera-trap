var Video = require("./Video.js");

var preview_el = document.getElementById("preview");

Video()
.then(function(video) {;
  video.bind(preview_el);

  var streaming = false;

  var button = document.getElementById("button");
  var inner = document.getElementById("inner-button");
  button.onclick = function(e) {
    e.preventDefault();

    if(streaming) {
      inner.setAttribute("fill", "grey");
    } else {
      inner.setAttribute("fill", "red");
    }

    streaming = !streaming;
  };
})
.catch(function(e) {
  console.error("Could not instantiate video", e);
});
