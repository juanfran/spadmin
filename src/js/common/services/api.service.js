class ApiService {
  constructor($http, $state, $q, spAdminConfig, Session) {
    Object.assign(this, {
      $http,
      $state,
      $q,
      spAdminConfig,
      Session
    });

    this.options = spAdminConfig.getOptions();
  }
  safeUrl(base, path) {
    if (base.substr(-1) !== '/') {
      base += '/';
    }

    if (path[0] === '/') {
      path = path.substring(1);
    }

    return base + path;
  }
  http(httpConfig) {
    httpConfig = _.clone(httpConfig);

    if (httpConfig.url) {
      httpConfig.url = this.safeUrl(this.options.baseUrl, httpConfig.url);
    }

    if (this.spAdminConfig.overrideGlobalHttpConfig) {
      httpConfig = this.spAdminConfig.overrideGlobalHttpConfig(httpConfig, this.Session.get());
    }

    return this.$http(httpConfig)
      .error(function(response) {
        var authErrors = [401, 403, 419, 440];

        if (response && authErrors.indexOf(response.status.index) !== -1) {
          this.$state.go('login');

          return this.$q.reject();
        }
      }.bind(this));
  }
  create (entity, data = {}, httpConfig = {}) {
    var baseUrl = entity.getBaseUrl()

    httpConfig = _.clone(httpConfig);

    var defaults = {
      url: baseUrl,
      data: data,
      method: 'POST'
    };

    _.defaults(httpConfig, defaults);

    return this.http(httpConfig);
  }
  update(id, entity, data = {}, httpConfig = {}) {
    var baseUrl = entity.getBaseUrl()

    httpConfig = _.clone(httpConfig);

    var defaults = {
      url: baseUrl + id,
      data: data,
      method: 'PUT'
    };

    _.defaults(httpConfig, defaults);

    return this.http(httpConfig);
  }
  getOne(id, entity, httpConfig = {}) {
    var baseUrl = entity.getBaseUrl()

    httpConfig = _.clone(httpConfig);

    var defaults = {
      url: baseUrl + id
    };

    _.defaults(httpConfig, defaults);

    return this.http(httpConfig);
  }
  httpEntity(entityName, httpConfig = {}, params={}) {
    httpConfig = _.clone(httpConfig);

    if (httpConfig.params) {
      httpConfig.params = _.merge(httpConfig.params, params);
    }

    if (!httpConfig.url) {
      httpConfig.url = entityName;
    }

    return this.http(httpConfig);
  }
  action(actionConfig, ids) {
    var httpConfig = _.clone(actionConfig.httpConfig);
    var params;

    if (httpConfig.params) {
      httpConfig.params = _.merge(httpConfig.params, actionConfig.params(ids));
    } else {
      httpConfig.params = {'ids': ids};
    }

    return this.http(httpConfig);
  }
}

angular.module('spAdmin').service('apiService', ApiService);
