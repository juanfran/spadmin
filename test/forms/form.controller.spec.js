describe("form controller", function() {
  var formController;
  var $scope;
  var mockModal, mockField, mockFlash, mockState, mockApiService;

  function _mockState() {
    _provide(function (provide) {
      mockState = {
        go:  sinon.spy()
      };

      provide.value('$state', mockState);
    });
  }

  function _mockFlash() {
    _provide(function (provide) {
      mockFlash = {
        set:  sinon.spy()
      };

      provide.value('flash', mockFlash);
    });
  }

  function _mockModal() {
    _provide(function (provide) {
      mockModal = {
        open:  sinon.stub()
      };

      provide.value('$modal', mockModal);
    });
  }

  function _mockField() {
    _provide(function (provide) {
      mockField = function(param) {
        this.param = param;
      }

      provide.value('Field', mockField);
    });
  }

  function _mockApiService() {
    _provide(function (provide) {
      mockApiService = {
        getOne: sinon.stub(),
        update: sinon.stub(),
        create: sinon.stub(),
        deleteElement: sinon.stub()
      };

      provide.value('apiService', mockApiService);
    });
  }

  function _inject() {
     inject(function ($controller) {
      formController = $controller('FormController');
    });
  }

  function _setup() {
    _mockState();
    _mockFlash();
    _mockField();
    _mockModal();
    _mockApiService();
    _inject();
  }

  beforeEach(function() {
    module('spAdmin');

    _setup();
  });

  it('get fields objects', function() {
    var fields = [
      {
        fieldset: {
          fields: ['fake1', 'fake2']
        }
      },
      'fake3'
    ];

    var fieldsObjects = formController.getFields(fields);

    expect(fieldsObjects[0].fieldset.fields[0]).to.be.an.instanceof(mockField);
    expect(fieldsObjects[0].fieldset.fields[1]).to.be.an.instanceof(mockField);
    expect(fieldsObjects[0].fieldset.fields[0].param).to.be.equal('fake1');
    expect(fieldsObjects[0].fieldset.fields[1].param).to.be.equal('fake2');

    expect(fieldsObjects[1]).to.be.an.instanceof(mockField);
    expect(fieldsObjects[1].param).to.be.equal('fake3');
  });

  it('set default values', function() {
    var fields = [
      {
        fieldset: {
          fields: [
            {value: 'aa', key: 'name'},
            {defaultValue: 'bb', key: 'lastname'}

          ]
        }
      },
      {value: 'aa', key: 'name2'},
      {defaultValue: 'bb', key: 'lastname2'}
    ];

    var scope = {};
    formController.setDefaultValues(fields, scope);

    expect(scope).to.be.eql({'lastname': 'bb', 'lastname2': 'bb'})
  });

  it('get one', function() {
    var id = 3;
    var entity = {
      name: 'users1',
      title: 'User'
    };

    var httpConfig = {
      'url': '/test'
    };

    mockApiService.getOne.withArgs(id, entity, httpConfig).returns('mock_result');

    var result = formController.getOne(id, entity, httpConfig);

    expect(result).to.be.equal('mock_result');
  });

  describe("create", function() {
    var entity, data, httpConfig;

    beforeEach(function() {
      entity = {
        name: 'users1',
        title: 'User',
        add: {}
      };

      data = {mock: 1};

      httpConfig = {
        'url': '/test'
      };
    });

    it("flash success", function() {
      var mockReturnCreate = {success: sinon.spy()};
      mockApiService.create.withArgs(entity, data, httpConfig).returns(mockReturnCreate);

      formController.create(entity, data, httpConfig);

      mockReturnCreate.success.callArg(0);

      expect(mockFlash.set.withArgs('Success').calledOnce).to.be.true;
    });

    it("go list", function() {
      var mockReturnCreate = {success: sinon.spy()};
      mockApiService.create.withArgs(entity, data, httpConfig).returns(mockReturnCreate);

      formController.create(entity, data, httpConfig);

      mockReturnCreate.success.callArg(0);

      expect(mockState.go.withArgs('list', {entityName: entity.name}).calledOnce).to.be.true;
    });

    it("transform response before create call", function() {
      var transformedData = {mock: 'xx'};

      entity.add.transformRequest = function(_data_) {
        expect(_data_).to.be.eql(data);

        return transformedData;
      };

      var mockReturnCreate = {success: sinon.spy()};
      mockApiService.create.withArgs(entity, transformedData, httpConfig).returns(mockReturnCreate);

      formController.create(entity, data, httpConfig);

      mockReturnCreate.success.callArg(0);

      expect(mockState.go.withArgs('list', {entityName: entity.name}).calledOnce).to.be.true;
    });
  });

  describe("update", function() {
    var id, entity, data, httpConfig;

    beforeEach(function() {
      id = 4;

      entity = {
        name: 'users1',
        title: 'User',
        edit: {}
      };

      data = {mock: 1};

      httpConfig = {
        'url': '/test'
      };
    });

    it("flash success", function() {
      var mockReturnUpdate = {success: sinon.spy()};
      mockApiService.update.withArgs(id, entity, data, httpConfig).returns(mockReturnUpdate);

      formController.update(id, entity, data, httpConfig);

      mockReturnUpdate.success.callArg(0);

      expect(mockFlash.set.withArgs('Success').calledOnce).to.be.true;
    });

    it("go list", function() {
      var mockReturnUpdate = {success: sinon.spy()};
      mockApiService.update.withArgs(id, entity, data, httpConfig).returns(mockReturnUpdate);

      formController.update(id, entity, data, httpConfig);

      mockReturnUpdate.success.callArg(0);

      expect(mockState.go.withArgs('list', {entityName: entity.name}).calledOnce).to.be.true;
    });

    it("transform response before create call", function() {
      var transformedData = {mock: 'xx'};

      entity.edit.transformRequest = function(_data_) {
        expect(_data_).to.be.eql(data);

        return transformedData;
      };

      var mockReturnUpdate = {success: sinon.spy()};
      mockApiService.update.withArgs(id, entity, transformedData, httpConfig).returns(mockReturnUpdate);

      formController.update(id, entity, data, httpConfig);

      mockReturnUpdate.success.callArg(0);

      expect(mockState.go.withArgs('list', {entityName: entity.name}).calledOnce).to.be.true;
    });
  });

  describe("delete", function() {
    var id, entity;
    var mockReturnModal;

    beforeEach(function() {
      id = 4;

      entity = {
        name: 'users1',
        title: 'User',
        edit: {}
      };

      mockReturnModal = {result: {then: sinon.spy()}};

      mockModal.open.withArgs({templateUrl: 'common/delete.html', controller: 'DeleteModalController'}).returns(mockReturnModal);
    });

    it("open modal", function() {
      formController.deleteElement(id, entity);

      expect(mockReturnModal.result.then.calledOnce).to.be.true;
    });

    describe("call delete element api", function() {
      beforeEach(function() {
        var mockReturnApiService = {success: sinon.spy()};
        mockApiService.deleteElement.withArgs(id, entity).returns(mockReturnApiService);

        formController.deleteElement(id, entity);

        mockReturnModal.result.then.callArg(0);
        mockReturnApiService.success.callArg(0);
      });

      it("on success go to list", function() {
        expect(mockState.go.withArgs('list', {entityName: entity.name}).calledOnce).to.be.true;
      });

      it("on success set flash message", function() {
        expect(mockFlash.set.withArgs('Element successfully removed').calledOnce).to.be.true;
      });
    });
  });
});
