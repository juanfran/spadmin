angular.module('spAdmin').directive('spAdminFormField', function ($compile, $templateCache) {
  return {
    link: function(scope, element, attr) {
      var template;

      if (scope.field.fieldset) {
        scope.elm = scope.field.fieldset;

        template = $templateCache.get('form/fieldset.html');
        element.append($compile(template)(scope));
      } else {
        scope.field.type = scope.field.type || 'string';
        scope.field.validation = scope.field.validation || {};

        if (scope.field.template) {
          template = scope.field.template;
        } else {
          template = $templateCache.get('form/fields/'+ scope.field.type  +'.html');
        }

        var result = $(template).appendTo(element);

        $compile(result)(scope);
      }
    }
  }
});
