describe("login controller", function() {
  var loginController;
  var $rootScope, $scope;
  var mockAuthService, mockState;

  function _mockAuthService() {
    _provide(function (provide) {
      mockAuthService = {
        login: sinon.stub()
      };

      provide.value('authService', mockAuthService);
    });
  }

  function _mockState() {
    _provide(function (provide) {
      mockState = {
        go: sinon.spy()
      };

      provide.value('$state', mockState);
    });
  }

  function _inject() {
     inject(function ($controller) {
       $scope = {};
       $rootScope = {
         $broadcast: sinon.spy()
       };

      loginController = $controller('LoginController', {
        $scope: $scope,
        $rootScope: $rootScope
      });
    });
  }

  function _setup() {
    _mockAuthService();
    _mockState();
    _inject();
  }

  beforeEach(function() {
    module('spAdmin');

    _setup();
  });

  it("valid login credentiasl", function() {
    var credentials = {
      username: 'username',
      password: '1234'
    };

    var promise = {
      then: sinon.spy()
    };

    mockAuthService.login.withArgs(credentials).returns(promise);

    $scope.login(credentials);

    promise.then.callArg(0);

    expect(mockState.go.withArgs('dashboard').calledOnce).to.be.true;
  });

  it("invalid login credentiasl", function() {
    var credentials = {
      username: 'username',
      password: '1234'
    };

    var promise = {
      then: sinon.spy()
    };

    mockAuthService.login.withArgs(credentials).returns(promise);

    $scope.login(credentials);

    promise.then.callArg(1);

    expect($rootScope.$broadcast.withArgs('fail', sinon.match.string).calledOnce).to.be.true;
  });
});
