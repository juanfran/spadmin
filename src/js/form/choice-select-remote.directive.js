angular.module('spAdmin').directive('spAdminChoiceSelectRemote', function (apiService) {
  return {
    replace: true,
    require: 'spAdminSelectRemote',
    templateUrl: 'form/fields/choice-select.html',
    link: function(scope, element, attr, selectRemote) {
      selectRemote.init();
    }
  }
});
