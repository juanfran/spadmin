angular.module('spAdmin').directive('spAdminMenu', function (Entities, authService) {
  return {
    scope: {},
    restrict: 'E',
    templateUrl: 'common/menu.html',
    link: function(scope) {
      var entities = Entities.getAll();

      scope.entities = _.toArray(entities);
      scope.isAuthenticated = authService.isAuthenticated;
    }
  }
});
