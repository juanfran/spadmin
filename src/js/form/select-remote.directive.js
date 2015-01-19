angular.module('spAdmin').directive('spAdminSelectRemote', function (apiService) {
  return {
    controller: function($scope) {
      this.init = function () {
        $scope.field.choices = [];

        apiService.http($scope.field.remoteChoices.httpConfig)
          .success(function(result) {
            if ($scope.field.remoteChoices.transformResponse) {
              result = $scope.field.remoteChoices.transformResponse(result);
            }

            if ($scope.field.remoteChoices.map) {
              result = _.map(result, $scope.field.remoteChoices.map);
            }

            $scope.field.choices = result;
          });
      }
    }
  }
});
