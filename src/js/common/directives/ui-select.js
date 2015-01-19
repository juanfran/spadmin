/*
  Fix ui-select bug with angular 1.3
  https://github.com/angular-ui/ui-select/issues/434
*/
angular.module('spAdmin').directive('uiSelect', function () {
  return {
    restrict: 'EA',
    require: 'uiSelect',
    link: function($scope, $element, $attributes, ctrl) {
      ctrl.resetSearchInput = true;
    }
  };
});
