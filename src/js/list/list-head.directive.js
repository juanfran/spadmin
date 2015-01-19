angular.module('spAdmin').directive('spAdminListHead', function ($state) {
  return {
    link: function(scope) {
      scope.sort = function(column) {
        if (column.sortable) {
          if (column.order === 'asc') {
            column.order = 'desc';
          } else {
            column.order = 'asc';
          }

          $state.go($state.$current, {
            order_by: column.key,
            order: column.order || 'asc'
          });
        }
      };
    }
  }
});
