angular.module('spAdmin').directive('spAdminListActions', function ($state, apiService, flash) {
  return {
    restrict: 'E',
    templateUrl: 'list/list-actions.html',
    link: function(scope) {
      scope.update = function() {
        var selected = _.filter(scope.list, 'checked');
        var ids = _.pluck(selected, 'identifier');

        apiService
          .action(scope.action, ids)
          .success(function() {
            var msg = scope.action.successMsg || 'Success';

            flash.set(msg);

            $state.go($state.$current, null, { reload: true });
          });
      }
    }
  }
});
