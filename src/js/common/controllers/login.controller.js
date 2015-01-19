angular.module('spAdmin')
  .controller('LoginController', function($rootScope, $scope, authService, $state) {
    $scope.credentials = {
      username: '',
      password: ''
    };

    $scope.login = function (credentials) {
      authService.login(credentials).then(function (user) {
        $state.go('dashboard');
      }, function () {
        $rootScope.$broadcast('fail', 'Something was wrong with the authenticantion.');
      });
    };
});
