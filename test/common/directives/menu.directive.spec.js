describe('menu', function () {
  var scope, compile;
  var mockEntities, mockAuthService;
  var validTemplate = '<sp-admin-menu></sp-admin-menu>';

  function _mockEntities() {
    _provide(function (provide) {
      mockEntities = {
        getAll:  sinon.stub()
      };

      provide.value('Entities', mockEntities);
    });
  }

  function _mockAuthService() {
    _provide(function (provide) {
      mockAuthService = {
        isAuthenticated: sinon.stub()
      };

      provide.value('authService', mockAuthService);
    });
  }

  function createDirective() {
    var elm;

    elm = compile(validTemplate)(scope);

    scope.$apply();

    return elm;
  }

  function _setup() {
    module('spAdmin');

    _mockAuthService();
    _mockEntities();

    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });
  }

  beforeEach(function () {
    _setup();
  });

  it('fill entities', function () {
    var entities = {
      'test1': {'name': 'test'},
      'test2': {'name': 'test2'}
    };

    mockEntities.getAll.returns(entities);

    var elm = createDirective();
    var isolated = elm.isolateScope();

    expect(isolated.entities).to.have.length(2);
  });

  it('fill authenticantion info', function () {
    var entities = {
      'test1': {'name': 'test'},
      'test2': {'name': 'test2'}
    };

    mockEntities.getAll.returns(entities);
    mockAuthService.isAuthenticated.returns(true);

    var elm = createDirective();
    var isolated = elm.isolateScope();

    expect(isolated.isAuthenticated()).to.be.true
  });
});
