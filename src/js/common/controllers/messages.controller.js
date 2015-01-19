angular.module('spAdmin').controller('MessagesController', function($scope, $timeout, flash) {
  var flashSuccess = function (text) {
    $scope.text = text;

    if ($scope.text) {
      $scope.activeSuccess = true;

      $timeout(function() {
        $scope.activeSuccess = false;
      }, 4000);
    }
  };

  var flashFail = function (text) {
    $scope.text = text;

    if ($scope.text) {
      $scope.activeFail = true;

      $timeout(function() {
        $scope.activeFail = false;
      }, 4000);
    }
  };

  $scope.$on('$stateChangeSuccess', () => {
    var text = flash.get();

    flashSuccess(text);
  });

  $scope.$on('success', (event, text) => {
    flashSuccess(text);
  });

  $scope.$on('fail', (event, text) => {
    flashFail(text);
  });
});
