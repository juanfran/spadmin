class ListResponse {
  constructor($templateCache, utilsService) {
    Object.assign(this, {
      utilsService,
      $templateCache
    });
  }
  formatResponse(response, status, headers, entity) {
    var totalItems, list;

    if (entity.list.pagination && entity.list.pagination.totalPages) {
      totalItems = entity.list.pagination.totalPages(response, status, headers);
    }

    if (entity.list.overrideResponse) {
      list = entity.list.overrideResponse(response, status, headers);
    }

    if (entity.list.map) {
      list = _.map(list, entity.list.map);
    }

    if (!list) {
      list = response;
    }

    return {items: list, totalItems: totalItems};
  }
  generateHeader(fieldsConfiguration, sort, entity) {
    var head = [];

    _.forEach(fieldsConfiguration, function(item) {
      var sortable = false;
      var order = '';

      if (entity.list.sort) {
        if (item.key === sort.order_by) {
          order = sort.order;
        }

        if (entity.list.sort.fields) {
          if (_.indexOf(entity.list.sort.fields, item.key) !== -1) {
            sortable = true;
          }
        }
      }

      head.push({
        label: item.label,
        key: item.key,
        sortable: sortable,
        order: order
      });
    });

    return head;
  }
  generateFieldsConfigurations(list, entity) {
    var fieldsConfiguration = [];

    if (!entity.list.include || !entity.list.include.length) {
      if (entity.list.exclude && entity.list.exclude.length) {
        list = _.omit(list[0], entity.list.exclude);
      } else {
        list = this.utilsService.sort_object(list[0]);
      }

      _.forEach(list, function(field, key) {
        fieldsConfiguration.push({
          key: key,
          label: key,
          link: false
        });
      });

      fieldsConfiguration[0].link = true;
    } else {
      fieldsConfiguration = _.map(entity.list.include, function(field) {
        if (_.isString(field)) {
          return {
            key: field,
            label: field,
            link: false
          };
        }

        return field;
      });
    }

    return fieldsConfiguration;
  }
  generateRows(list, fieldsConfiguration, entity) {
    var rows = [];

    _.forEach(list, (row) => {
      var fields = [];

      _.forEach(fieldsConfiguration, (configField) => {
        var value;

        if (configField.key) {
          value = row[configField.key];
        }

        if (configField.override) {
          value = configField.override(row);
        } else if (entity.list.override) {
          value = entity.list.override(configField.key, value);
        }

        // TODO: templateCache service
        if (!configField.template) {
          if (_.isBoolean(value)) {
            configField.template = this.$templateCache.get('list/list-boolean.html');
          } else if (_.isArray(value)) {
            configField.template = this.$templateCache.get('list/list-array.html');
          } else {
            configField.template = this.$templateCache.get('list/list-string.html');
          }
        }

        var obj = {
          value: value,
          config: configField
        };

        fields.push(obj);
      });

      rows.push({
        entity: {
          identifier: row[entity.identifier],
          name: entity.name
        },
        fields: fields
      });
    });

    return rows;
 }
  parseListResponse(response, status, headers, entity, sort={}) {
    var {items, totalItems} = this.formatResponse(response, status, headers, entity);
    var fieldsConfiguration = this.generateFieldsConfigurations(items, entity);
    var head = this.generateHeader(fieldsConfiguration, sort, entity);
    var list = this.generateRows(items, fieldsConfiguration, entity);

    return {
      getTotalItems: function() {
        return totalItems;
      },
      getList: function() {
        return list;
      },
      getHead: function() {
        return head;
      }
    }
  }
}

angular.module('spAdmin').service('listResponse', ListResponse);
