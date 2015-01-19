angular.module('spAdmin')
.factory('authService', function (apiService, Session, spAdminConfig) {
  var authService = {};

  authService.login = function (credentials) {
    var options = spAdminConfig.getOptions();

    var httpConfig = {};

    httpConfig.data = credentials;
    httpConfig.url = options.authUrl;
    httpConfig.method = 'POST';

    return apiService.http(httpConfig)
      .then(function (res) {
        console.log(res);
        var data = res.data;

        if (spAdminConfig.overrideAuthResponseData) {
          data = spAdminConfig.overrideAuthResponseData(res);
        }

        Session.create(data);
      });
  };

  authService.isAuthenticated = function () {
    return !!Session.get();
  };

  return authService;
});
