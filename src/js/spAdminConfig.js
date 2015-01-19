var spAdmin = angular.module('spAdmin', ['ui.bootstrap', 'ngSanitize', 'ngAnimate', 'ui.router', 'ui.select', 'templates']);

spAdmin.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('login', {
      url: '/login/',
      templateUrl: 'common/login.html',
      data: {
        login: false
      }
    })
    .state('list', {
      url: '/list/:entityName/:page?order_by&order',
      templateUrl: 'list/list-page.html'
    })
    .state('add', {
      url: '/add/:entityName',
      templateUrl: 'form/add-page.html'
    })
    .state('edit', {
      url: '/edit/:entityName/:id',
      templateUrl: 'form/edit-page.html'
    })
    .state('dashboard', {
      url: '/',
      templateUrl: 'dashboard/dashboard-page.html'
    });
});

spAdmin.provider('spAdminConfig', function() {
  var authResponseFn, httpConfigFn;
  var services = [];
  var options = {
    auth: false
  };

  this.add = function() {
    services.push.apply(services, arguments);
  };

  this.setBaseUrl = function(url) {
    options.baseUrl = url;
  };

  this.auth = function(auth, url) {
    options.auth = auth;
    options.authUrl = url;
  };

  this.overrideAuthResponseData = function (fn) {
    authResponseFn = fn;
  };

  this.overrideGlobalHttpConfig = function (fn) {
    httpConfigFn = fn;
  };

  this.$get = ['$rootScope', function($rootScope) {
    return {
      updateTitle: function(title) {
        $rootScope.$emit('title', title);
      },
      getServices: function() {
        return services;
      },
      getOptions: function() {
        return options;
      },
      overrideAuthResponseData: function(res) {
        return authResponseFn.apply(null, arguments);
      },
      overrideGlobalHttpConfig: function() {
        return httpConfigFn.apply(null, arguments);
      }
    }
  }];
});

spAdmin.factory('runService', function (spAdminConfig, $injector, $rootScope, $state, authService) {

  var init = function() {
    var services = spAdminConfig.getServices();
    var options = spAdminConfig.getOptions();

    for (var service of services) {
      $injector.get(service);
    }

    $rootScope.$on('$stateChangeStart', function (event, next) {
      var loginRequired = options.auth;

      if (next.data && next.data.login !== undefined) {
        loginRequired = false;
      }

      if (loginRequired && !authService.isAuthenticated()) {
        event.preventDefault();
        $state.go('login');
      }
    });
  }

  return {
    init: init
  }
});

spAdmin.run(function (runService) {
  runService.init();
});
