describe("select remote", function() {
  var scope, compile, controller;
  var mockApiService;
  var validTemplate = '<sp-admin-select-remote></sp-admin-select-remote>';
  var field;

  function _mockApiService() {
    _provide(function (provide) {
      mockApiService = {
        http: sinon.stub()
      };

      provide.value('apiService', mockApiService);
    });
  }

  function createDirective() {
    var el = angular.element(validTemplate);
    compile(el)(scope);

    scope.$apply();

    controller = el.controller('spAdminSelectRemote');

    scope = el.isolateScope() || el.scope();
  }

  function _setup() {
    module('spAdmin');

    _mockApiService();

    field = {
      remoteChoices: {
        httpConfig: {
          url: '/fake'
        }
      }
    };

    inject(function ($rootScope, $compile, $templateCache) {
      scope = $rootScope.$new();

      compile = $compile;
    });
  }

  beforeEach(function () {
    _setup();
  });

  it("success must field the scope choices with the result", function() {
    var mockReturnHttp = {success: sinon.spy()};
    var result = ['mock1', 'mock2'];

    mockApiService.http.withArgs(field.remoteChoices.httpConfig).returns(mockReturnHttp);

    createDirective();

    scope.field = field;

    controller.init();

    mockReturnHttp.success.callArgWith(0, result);

    expect(scope.field.choices).to.be.eql(result);
  });

  it("transform response", function() {
    var mockReturnHttp = {success: sinon.spy()};
    var result = ['mock1', 'mock2'];
    var result2 = ['mock1_x', 'mock2_x'];

    mockApiService.http.withArgs(field.remoteChoices.httpConfig).returns(mockReturnHttp);

    createDirective();

    field.remoteChoices.transformResponse = function(_result_) {
      expect(_result_).to.be.eql(result);

      return result2;
    };

    scope.field = field;

    controller.init();

    mockReturnHttp.success.callArgWith(0, result);

    expect(scope.field.choices).to.be.eql(result2);
  });

  it("map response", function() {
    var mockReturnHttp = {success: sinon.spy()};
    var result = ['mock1', 'mock2'];
    var result2 = ['mock1_x', 'mock2_x'];

    mockApiService.http.withArgs(field.remoteChoices.httpConfig).returns(mockReturnHttp);

    createDirective();

    field.remoteChoices.map = function(item) {
      return item + "_x";
    };

    scope.field = field;

    controller.init();

    mockReturnHttp.success.callArgWith(0, result);

    expect(scope.field.choices).to.be.eql(result2);
  });
});
