angular.module('spAdmin')
.directive('spAdminLogin', function () {
  return {
    controller: 'LoginController',
    restrict: 'E'
  }
});
