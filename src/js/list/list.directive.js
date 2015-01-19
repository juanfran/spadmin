angular.module('spAdmin').directive('spAdminList', function (Entities, spAdminConfig, $stateParams, apiService, $state, listResponse) {
  return {
    controller: 'ListController',
    templateUrl: 'list/list.html',
    scope: {}
  }
});
