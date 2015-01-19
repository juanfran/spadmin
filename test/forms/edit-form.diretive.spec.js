describe('edit form directive', function () {
  var scope, compile;
  var mockEntities, mockSpAdminConfig, mockStateParams, mockSpAdminFormCtrl, mockGetOneResponse;
  var validTemplate = '<sp-admin-edit-form></sp-admin-edit-form>';
  var entity = {};
  var fields = ['field1_mock', 'field2_mock', 'field3_mock'];
  var stateId = 5;

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
      mockStateParams = {
        id: stateId
      };

      provide.value('$stateParams', mockStateParams);
    });
  }

  function createDirective() {
    var elm;

    mockSpAdminFormCtrl = {
      getFields: sinon.stub(),
      setDefaultValues: sinon.spy(),
      update: sinon.spy(),
      deleteElement: sinon.spy(),
      getOne: sinon.stub()
    };

    mockGetOneResponse = {
      success: sinon.spy()
    }

    mockSpAdminFormCtrl.getFields.withArgs(entity.edit.fields).returns(fields);
    mockSpAdminFormCtrl.getOne.withArgs(stateId, entity, entity.edit.httpConfig).returns(mockGetOneResponse);

    var element = angular.element(validTemplate);
    element.data('$spAdminFormController', mockSpAdminFormCtrl);

    elm = compile(element)(scope);

    scope.$apply();

    return elm;
  }

  function _setup() {
    module('spAdmin');

    entity = {
      identifier: 'id',
      name: 'users1',
      title: 'User',
      edit: {
        fields: ['field1', 'field2', 'field3'],
        httpConfig: {
          mock: 'mock'
        }
      }
    };

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

    var elmScope = elm.isolateScope();

    expect(elmScope.entity).to.be.eql(entity);
  });

  it('fill scope title', function () {
    var elm = createDirective();

    var elmScope = elm.isolateScope();

    expect(elmScope.title).to.be.eql("Edit - " + entity.title);
  });

  it('delete btn by default', function () {
    var elm = createDirective();

    var elmScope = elm.isolateScope();

    expect(elmScope.deleteBtn).to.be.true;
  });

  it('fill scope with fields', function () {
    var elm = createDirective();

    var elmScope = elm.isolateScope();

    expect(elmScope.fields).to.be.eql(fields);
  });

  it('set default values', function() {
    var elm = createDirective();

    var elmScope = elm.isolateScope();

    expect(mockSpAdminFormCtrl.setDefaultValues.withArgs(fields, {}).calledOnce).to.be.true;
  });

  it('update title with the scope title', function () {
    var elm = createDirective();

    var elmScope = elm.isolateScope();

    expect(mockSpAdminConfig.updateTitle.withArgs(elmScope.title).calledOnce).to.be.true;
  });

  it('save form', function () {
    var elm = createDirective();

    var elmScope = elm.isolateScope();

    elmScope.save();

    expect(mockSpAdminFormCtrl.update.withArgs(stateId, entity, elmScope.data, entity.edit.httpConfig).calledOnce).to.be.true;
  });

  it('delete element', function () {
    var elm = createDirective();

    var elmScope = elm.isolateScope();

    elmScope.deleteElement();

    expect(mockSpAdminFormCtrl.deleteElement.withArgs(stateId, entity).calledOnce).to.be.true;
  });

  describe('fill scope data,', function (){
    it('default behavior', function() {
      var elm = createDirective();

      var elmScope = elm.isolateScope();

      var response = ['mock1', 'mock2', 'mock3'];

      mockGetOneResponse.success.callArgWith(0, response);

      expect(elmScope.data).to.be.eql(response);
    });

    it('transform response', function() {
      var transformResponse = ['mock1_a', 'mock2_a', 'mock3_a'];

      entity.edit.transformResponse = function() {
        return transformResponse;
      };
      var elm = createDirective();

      var elmScope = elm.isolateScope();

      var response = ['mock1', 'mock2', 'mock3'];

      mockGetOneResponse.success.callArgWith(0, response);

      expect(elmScope.data).to.be.eql(transformResponse);
    });

    it('map values response', function() {
      entity.edit.mapValues = function(responseItem) {
        return {label: responseItem.labelll};
      };

      var elm = createDirective();

      var elmScope = elm.isolateScope();

      var response = {
        name: {labelll: 'xx'}
      };

      mockGetOneResponse.success.callArgWith(0, response);
      expect(elmScope.data).to.be.eql({name: {label: 'xx'}});
    });
  });
});
