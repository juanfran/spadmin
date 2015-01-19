function _provide(callback) {
  module(function ($provide) {
    callback($provide);
  });
}

function _mockRunService() {
  _provide(function (provide) {
    var mockRunService = {
      init: sinon.spy()
    };

    provide.value('runService', mockRunService);
  });
}
