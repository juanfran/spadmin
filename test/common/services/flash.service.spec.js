describe("flash service", function() {
  var flashService;

  function _inject() {
    inject(function (_flash_) {
       flashService = _flash_;
    });
  }

  function _setup() {
    _inject();
  }

  beforeEach(function() {
    module('spAdmin');

    _setup();
  });

  it("set flash", function() {
    var text = "xx yy zz";

    flashService.set(text);

    var result = flashService._getLast();

    expect(result).to.be.equal(text);
  });

  it("get flash once", function() {
    var text = "xx yy zz";

    flashService.set(text);

    var result = flashService.get();

    expect(result).to.be.equal(text);

    result = flashService.get();

    expect(result).to.be.null;
  });
});
