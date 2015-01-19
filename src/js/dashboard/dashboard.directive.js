angular.module('spAdmin').directive('spAdminDashboard', function () {
  return {
    controller: 'DashboardController',
    templateUrl: 'dashboard/dashboard-directive.html',
    scope: {}
  }
});
