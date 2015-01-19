angular.module('spAdmin').directive('spAdminAddForm', function ($stateParams, Entities, spAdminConfig) {
  return {
    require: 'spAdminForm',
    templateUrl: 'form/form.html',
    link: function(scope, element, attrs, formCtrl) {
      var entityName = $stateParams.entityName;
      var entity = Entities.get(entityName);
      var entityForm = entity.add;

      scope.entity = entity;

      scope.data = {};

      scope.title = entityForm.title || 'Add - ' + entity.title;
      scope.fields = formCtrl.getFields(entityForm.fields);

      formCtrl.setDefaultValues(scope.fields, scope.data);

      spAdminConfig.updateTitle(scope.title);

      scope.save = function() {
        formCtrl.create(entity, scope.data, entityForm.httpConfig);
      };
    }
  }
});
