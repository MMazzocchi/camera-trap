var Socket = function() {
  return new Promise(function(resolve, reject) {
    try {
      var url = window.location;
      var socket = new WebSocket("ws://"+url.host+"/input");

      socket.onopen = function() {
        resolve(socket);
      };

      socket.onerror = function(e) {
        if(e.message === undefined) {
          e.message = "Connection failed.";
        }
        reject(e);
      };

    } catch(e) {
      reject(e);
    }
  });
};

module.exports = Socket;
