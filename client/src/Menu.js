var EventEmitter = require("events");

var Menu = function(socket) {
  var that = new EventEmitter();

  // Fields
  var menu = document.getElementById("menu");
  var menu_btn = document.getElementById("menu-button");
  var close_btn = document.getElementById("close-button");

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
  };

  setup();
  return that;
};

module.exports = Menu;
