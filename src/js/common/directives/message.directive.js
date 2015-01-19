angular.module('spAdmin').directive('spAdminMessages', function ($rootScope, $timeout, flash) {
  return {
    scope: {},
    restrict: 'E',
    controller: 'MessagesController',
    templateUrl: 'common/messages.html'
  }
});
