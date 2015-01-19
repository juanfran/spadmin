describe('add form directive', function () {
  var scope, compile;
  var mockEntities, mockSpAdminConfig, mockStateParams, mockSpAdminFormCtrl;
  var validTemplate = '<sp-admin-add-form></sp-admin-add-form>';
  var entity = {
    identifier: 'id',
    name: 'users1',
    title: 'User',
    add: {
      fields: ['field1', 'field2', 'field3'],
      httpConfig: {
        mock: 'mock'
      }
    }
  };
  var fields = ['field1_mock', 'field2_mock', 'field3_mock'];

  function _mockEntities() {
    _provide(function (provide) {
      mockEntities = {
        get: sinon.stub()
      };

      provide.value('Entities', mockEntities);
    });
  }

  function _mockSpAdminConfig() {
    _provide(function (provide) {
      mockSpAdminConfig = {
        updateTitle: sinon.stub()
      };

      provide.value('spAdminConfig', mockSpAdminConfig);
    });
  }

  function _mockStateParams() {
    _provide(function (provide) {
      mockStateParams = {};

      provide.value('$stateParams', mockStateParams);
    });
  }

  function createDirective() {
    var elm;

    mockSpAdminFormCtrl = {
      getFields: sinon.stub(),
      setDefaultValues: sinon.stub(),
      create: sinon.spy()
    };

    mockSpAdminFormCtrl.getFields.withArgs(entity.add.fields).returns(fields);

    var element = angular.element(validTemplate);
    element.data('$spAdminFormController', mockSpAdminFormCtrl);

    elm = compile(element)(scope);

    scope.$apply();

    return elm;
  }

  function _setup() {
    module('spAdmin');

    _mockStateParams();
    _mockEntities();
    _mockSpAdminConfig();
    _mockRunService();

    inject(function ($rootScope, $compile, $templateCache) {
      scope = $rootScope.$new();
      compile = $compile;
      $templateCache.put('form/form.html', '');
    });
  }

  beforeEach(function () {
    _setup();

    mockStateParams.entityName = 'entitytest';
    mockEntities.get.withArgs('entitytest').returns(entity);
  });

  it('fill scope entity', function () {
    var elm = createDirective();

    var elmScope = elm.scope();

    expect(elmScope.entity).to.be.eql(entity);
  });

  it('fill scope title', function () {
    var elm = createDirective();

    var elmScope = elm.scope();

    expect(elmScope.title).to.be.eql("Add - " + entity.title);
  });

  it('fill scope with fields', function () {
    var elm = createDirective();

    var elmScope = elm.scope();

    expect(elmScope.fields).to.be.eql(fields);
  });

  it('update title with the scope title', function () {
    var elm = createDirective();

    var elmScope = elm.scope();

    expect(mockSpAdminConfig.updateTitle.withArgs(elmScope.title).calledOnce).to.be.true;
  });

  it('save form', function () {
    var elm = createDirective();

    var elmScope = elm.scope();

    elmScope.save();

    expect(mockSpAdminFormCtrl.create.withArgs(entity, elmScope.data, entity.add.httpConfig).calledOnce).to.be.true;
  });
});
