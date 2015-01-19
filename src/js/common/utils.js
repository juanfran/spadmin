angular.module('spAdmin').factory('utilsService', function() {
  var sort_object = function (map) {
    var keys = _.sortBy(_.keys(map), function(a) { return a; });
    var newmap = {};

    _.each(keys, function(k) {
      newmap[k] = map[k];
    });

    return newmap;
  }

  return {
    sort_object: sort_object
  }
});
