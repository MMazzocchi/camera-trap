var fullscreen = function(el) {
  function activate() {
    el.requestFullscreen       ? el.requestFullscreen()       :
    el.webkitRequestFullscreen ? el.webkitRequestFullscreen() :
    el.mozRequestFullScreen    ? el.mozRequestFullScreen()    :
    el.msRequestFullscreen     ? el.msRequestFullscreen()     :
    console.error("Fullscreen not supported.");
  };

  function deactivate() {
    document.exitFullscreen       ? document.exitFullscreen()       :
    document.webkitExitFullscreen ? document.webkitExitFullscreen() :
    document.mozCancelFullScreen  ? document.mozCancelFullScreen()  :
    document.msExitFullscreen     ? document.msExitFullscreen()     :
    console.error("Exiting fullscreen not supported.");
  };

  el.ondblclick = function(e) {
    e.preventDefault();

    if(document.webkitFullscreenElement ||
       document.mozFullScreenElement    ||
       document.msFullscreenElement) {
      deactivate();

    } else {
      activate();
    }
  };
};

module.exports = fullscreen;
