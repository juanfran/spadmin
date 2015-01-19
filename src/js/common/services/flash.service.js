angular.module('spAdmin').factory('flash', function () {
  var last;

  return {
    _getLast: function() {
      return last;
    },
    set: function(text) {
      last = text;
    },
    get: function() {
      var text = last;

      last = null;

      return text;
    }
  }
});
