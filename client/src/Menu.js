var EventEmitter = require("events");

var Menu = function(socket, video) {
  var that = new EventEmitter();

  // Fields
  var menu = document.getElementById("menu");
  var menu_btn = document.getElementById("menu-button");
  var close_btn = document.getElementById("close-button");
  var zoom_slider = document.getElementById("zoom");

  // Private methods
  function sendRotation(value) {
    
  };

  function setup() {
    menu_btn.onclick = function(e) {
      e.preventDefault();
      menu.style.display = "block";
    };

    close_btn.onclick = function(e) {
      e.preventDefault();
      menu.style.display = "none";
    };

    zoom_slider.value = 0;
    if(video.zoomAvailable()) {
      zoom_slider.oninput = function(e) {
        video.setZoom(zoom_slider.value / 100);
      };
    } else {
      zoom_slider.disabled = true;
    }
  };

  setup();
  return that;
};

module.exports = Menu;
