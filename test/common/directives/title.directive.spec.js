describe('title', function () {
  var scope, compile, $rootScope;
  var validTemplate = '<sp-admin-title></sp-admin-title>';

  function createDirective() {
    var elm;

    elm = compile(validTemplate)(scope);

    scope.$apply();

    return elm;
  }

  function _setup() {
    module('spAdmin');

    inject(function (_$rootScope_, $compile) {
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();
      compile = $compile;
    });
  }

  beforeEach(function () {
    _setup();
  });

  it('set title', function () {
    var elm = createDirective();
    var isolated = elm.isolateScope();

    var title = "page title";
    $rootScope.$emit('title', title);

    expect(elm.text()).to.be.equal(title);
  });
});
