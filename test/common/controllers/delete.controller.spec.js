describe("configuration controller", function() {
  var deleteModalController;
  var $scope;
  var mockModalInstance;

  function _mockModalInstance() {
    _provide(function (provide) {
      mockModalInstance = {
        dismiss:  sinon.spy(),
        close: sinon.spy()
      };

      provide.value('$modalInstance', mockModalInstance);
    });
  }

  function _inject() {
     inject(function ($controller) {
      $scope = {};
      deleteModalController = $controller('DeleteModalController', {
        $scope: $scope
      });
    });
  }

  function _setup() {
    _mockModalInstance();
    _inject();
  }

  beforeEach(function() {
    module('spAdmin');

    _setup();
  });

  it("ok modalInstance close", function() {
    $scope.ok();

    expect(mockModalInstance.close.calledOnce).to.be.true;
  });

  it("cancel modalInstance dismiss", function() {
    $scope.cancel();

    expect(mockModalInstance.dismiss.withArgs('cancel').calledOnce).to.be.true;
  });
});
