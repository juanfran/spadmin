describe("list head", function() {
  var provide;
  var scope, compile;
  var mockState;
  var validTemplate = '<sp-admin-list-head></sp-admin-list-head>';

  function _mocks() {
    _provide(function (_provide_) {
      provide = _provide_;

      _mockState();
    });
  }

  function _mockState() {
    mockState = {
      go: sinon.stub(),
      $current: '/users'
    };

    provide.value('$state', mockState);
  }

  function createDirective() {
    var el = angular.element(validTemplate);
    compile(el)(scope);

    scope.$apply();

    scope = el.isolateScope() || el.scope();
  }

  function _setup() {
    module('spAdmin');

    _mocks();

    inject(function ($rootScope, $compile, $templateCache) {
      scope = $rootScope.$new();

      compile = $compile;
    });
  }

  beforeEach(function () {
    _setup();
  });

  it("sort desc", function() {
    createDirective();

    var column = {
      key: 'user',
      sortable: true,
      order: 'asc'
    };

    scope.sort(column);

    var sort = {
      order_by: 'user',
      order: 'desc'
    }

    expect(mockState.go.withArgs(mockState.$current, sort).calledOnce).to.be.true;
  });

  it("sort asc", function() {
    createDirective();

    var column = {
      key: 'user',
      sortable: true,
      order: 'desc'
    };

    scope.sort(column);

    var sort = {
      order_by: 'user',
      order: 'asc'
    }

    expect(mockState.go.withArgs(mockState.$current, sort).calledOnce).to.be.true;
  });
});
