var Socket = function() {
  return new Promise(function(resolve, reject) {

    try {
      var url = window.location;
      var socket = new WebSocket("wss://"+url.host);

      // On an open event, resolve with the socket
      function handleOpen() {
        socket.removeEventListener("open", handleOpen);
        resolve(socket);
      };
      socket.addEventListener("open", handleOpen);

      // On an error event, reject the promise
      function handleError(e) {
        if(e.message === undefined) {
          e.message = "Connection failed.";
        }
        socket.removeEventListener("error", handleError);
        reject(e);
      };
      socket.addEventListener("error", handleError);

    } catch(e) {
      reject(e);
    }
  });
};

module.exports = Socket;
