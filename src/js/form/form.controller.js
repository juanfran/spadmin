class FormController {
  constructor(Field, apiService, flash, $state, $modal) {
    Object.assign(this, {
      Field, apiService, flash, $state, $modal
    })
  }

  getFields(fields) {
    return _.map(fields, (field) => {
      if(field.fieldset) {
        field.fieldset.fields = this.getFields(field.fieldset.fields);
        return field;
      } else {
        return new this.Field(field);
      }
    })
  }

  setDefaultValues(fields, scopeData) {
    _.forEach(fields, (field) => {
      if(field.fieldset) {
        this.setDefaultValues(field.fieldset.fields, scopeData);
      } else if(field.defaultValue){
        scopeData[field.key] = field.defaultValue;
      }
    });
  }

  getOne(id, entity, httpConfig) {
    return this.apiService.getOne(id, entity, httpConfig)
  };

  create(entity, data, httpConfig) {
    if (entity.add.transformRequest) {
      data = entity.add.transformRequest(data);
    }

    this.apiService.create(entity, data, httpConfig).success(() => {
      var msg = 'Success';

      this.flash.set(msg);
      this.$state.go('list', {entityName: entity.name});
    });
  };

  update(id, entity, data, httpConfig) {
    if (entity.edit.transformRequest) {
      data = entity.edit.transformRequest(data);
    }

    this.apiService.update(id, entity, data, httpConfig).success(() => {
      var msg = 'Success';

      this.flash.set(msg);
      this.$state.go('list', {entityName: entity.name});
    });
  };

  deleteElement(id, entity) {
    var modalInstance = this.$modal.open({
      templateUrl: 'common/delete.html',
      controller: 'DeleteModalController',
    });

    modalInstance.result.then(() => {
      this.apiService.deleteElement(id, entity).success(() => {
        this.flash.set("Element successfully removed");
        this.$state.go('list', {entityName: entity.name});
      });
    });
  };
}

angular.module('spAdmin').controller('FormController', FormController);
