angular.module('spAdmin').directive('spAdminListField', function ($compile) {
  return {
    restrict: 'E',
    scope: {field: '=', entity: '='},
    link: function(scope, element, attrs) {
      element.append($compile(scope.field.config.template)(scope));
    }
  }
});
