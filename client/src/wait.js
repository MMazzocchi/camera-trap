var wait = function(timeout) {
  return new Promise(function(resolve) {
    setTimeout(resolve, timeout);
  });
};

module.exports = wait;
