angular.module('spAdmin').directive('spAdminForm', function () {
  return {
    priority: 1,
    controller: 'FormController'
  }
});
