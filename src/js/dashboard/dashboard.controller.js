angular.module('spAdmin').controller('DashboardController', function ($scope, Entities, spAdminConfig) {
  var entities = Entities.getAll();

  $scope.dashboard = _.toArray(entities);

  spAdminConfig.updateTitle('Dashboard');
});
