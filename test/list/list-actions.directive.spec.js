describe("list actions", function() {
  var provide;
  var scope, compile;
  var mockApiService, mockState, mockFlash;
  var validTemplate = '<sp-admin-list-actions></sp-admin-list-actions>';

  function _mocks() {
    _provide(function (_provide_) {
      provide = _provide_;

      _mockApiService();
      _mockState();
      _mockFlash();
    });
  }

  function _mockApiService() {
    mockApiService = {
      action: sinon.stub()
    };

    provide.value('apiService', mockApiService);
  }

  function _mockState() {
    mockState = {
      go: sinon.stub(),
      $current: '/users'
    };

    provide.value('$state', mockState);
  }

  function _mockFlash() {
    mockFlash = {
      set: sinon.spy()
    };

    provide.value('flash', mockFlash);
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

  it("call api with the action & selected ids", function() {
    scope.list = [
      {identifier: 1, checked: false},
      {identifier: 2, checked: true},
      {identifier: 3, checked: true},
      {identifier: 4, checked: false}
    ];

    scope.action = 'action';

    createDirective();

    mockApiService.action.returns({success: sinon.spy()});

    scope.update();

    expect(mockApiService.action.withArgs('action', [2,3]).calledOnce).to.be.true;
  });

  it("reload page and set a flash msg", function() {
    scope.list = [];
    scope.action = {
      successMsg: 'ok ok'
    };

    createDirective();

    var actionReturnMock = {success: sinon.spy()}
    mockApiService.action.returns(actionReturnMock);

    scope.update();

    actionReturnMock.success.callArg(0);

    expect(mockFlash.set.withArgs('ok ok').calledOnce).to.be.true;
    expect(mockState.go.withArgs(mockState.$current, null, {reload: true}).calledOnce).to.be.true;
  });
});
