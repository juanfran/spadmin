angular.module('spAdmin').directive('spAdminChoicesSelectRemote', function (apiService) {
  return {
    replace: true,
    require: 'spAdminSelectRemote',
    templateUrl: 'form/fields/choices-select.html',
    link: function(scope, element, attr, selectRemote) {
      selectRemote.init();
    }
  }
});
