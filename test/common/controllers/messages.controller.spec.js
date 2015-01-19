describe("messages controller", function() {
  var messagesController;
  var $scope, $timeout;
  var mockFlash;

  function _mockFlash() {
    _provide(function (provide) {
      mockFlash = {
        get: sinon.stub()
      };

      provide.value('flash', mockFlash);
    });
  }

  function _inject() {
     inject(function ($controller, _$timeout_) {
       $timeout = _$timeout_;
       $scope = {
         $on: sinon.spy(),
       };

       messagesController = $controller('MessagesController', {
         $scope: $scope,
         $timeout: $timeout
       });
    });
  }

  function _setup() {
    _mockFlash();
    _inject();
  }

  beforeEach(function() {
    module('spAdmin');

    _setup();
  });

  it("flash success on state change", function() {
    var text = 'text text';

    mockFlash.get.returns(text);

    $scope.$on.withArgs('$stateChangeSuccess').callArg(1);

    expect($scope.text).to.be.equals(text);
    expect($scope.activeSuccess).to.be.true;
    $timeout.flush();
    expect($scope.activeSuccess).to.be.false;
  });

  it("flash success on success event", function() {
    var text = 'text text';

    $scope.$on.withArgs('success').callArgWith(1, {}, text);

    expect($scope.text).to.be.equals(text);
    expect($scope.activeSuccess).to.be.true;
    $timeout.flush();
    expect($scope.activeSuccess).to.be.false;
  });

  it("flash fail on fail event", function() {
    var text = 'text text';

    $scope.$on.withArgs('fail').callArgWith(1, {}, text);

    expect($scope.text).to.be.equals(text);
    expect($scope.activeFail).to.be.true;
    $timeout.flush();
    expect($scope.activeFail).to.be.false;
  });
});
