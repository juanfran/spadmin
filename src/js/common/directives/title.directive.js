angular.module('spAdmin').directive('spAdminTitle', function ($rootScope) {
  return {
    scope: {},
    link: function (scope, element) {
      $rootScope.$on('title', function(event, title='SPAdmin') {
        element.text(title);
        event.stopPropagation();
      });
    }
  }
});
