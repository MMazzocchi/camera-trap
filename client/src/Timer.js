var Timer = function(interval, callback) {
  var that = {};

  // Fields
  var interval_id = undefined;

  // Public methods
  that.start = function() {
    if(interval_id === undefined) {
      interval_id = setInterval(callback, interval);
    }
  };

  that.stop = function() {
    if(interval_id !== undefined) {
      clearInterval(interval_id);
      interval_id = undefined;
    }
  };

  that.running = function() {
    return (interval_id !== undefined);
  };

  return that;
};

module.exports = Timer;
