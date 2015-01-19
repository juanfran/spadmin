angular.module('spAdmin').directive('spAdminEditForm', function ($stateParams, Entities, spAdminConfig) {
  return {
    require: 'spAdminForm',
    templateUrl: 'form/form.html',
    scope: {},
    link: function(scope, element, attrs, formCtrl) {
      var entityName = $stateParams.entityName;
      var id = $stateParams.id;
      var entity = Entities.get(entityName);
      var entityForm = entity.edit;

      scope.entity = entity;
      scope.deleteBtn = true;

      scope.data = {};

      scope.title = entityForm.title || 'Edit - ' + entity.title;
      scope.fields = formCtrl.getFields(entityForm.fields);

      formCtrl.setDefaultValues(scope.fields, scope.data);
      formCtrl.getOne($stateParams.id, entity, entityForm.httpConfig)
        .success(function(response) {
          if (entityForm.transformResponse) {
            response = entityForm.transformResponse(response);
          }

          if (entityForm.mapValues) {
            response = _.mapValues(response, entityForm.mapValues);
          }

          scope.data = response;
        });

      spAdminConfig.updateTitle(scope.title);

      scope.save = function() {
        formCtrl.update(id, entity, scope.data, entityForm.httpConfig);
      }

      scope.deleteElement = function() {
        formCtrl.deleteElement(id, entity);
      }
    }
  }
});
