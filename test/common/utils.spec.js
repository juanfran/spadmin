describe("utilsService", function() {
  var utilsService;

  function _inject() {
    inject(function (_utilsService_) {
       utilsService = _utilsService_;
    });
  }

  function _setup() {
    _inject();
  }

  beforeEach(function() {
    module('spAdmin');

    _setup();
  });

  it("sort map", function() {
    var map = {'www': 1, 'aa': 2, 'z': 3, 'b': 4};
    var map_sorted = {'aa': 2, 'b': 4, 'www': 1, 'z': 3};

    var result = utilsService.sort_object(map);

    expect(Object.keys(result)).to.be.eql(['aa', 'b', 'www', 'z']);
  });
});
