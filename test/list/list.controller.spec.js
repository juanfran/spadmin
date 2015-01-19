describe("list controller", function() {
  var entityName = 'users';
  var provide;
  var listController, $scope;
  var mockEntities, mockSpAdminConfig, mockApiService, mockStateParams, mockQ,
  mockState, mockListResponse;
  var entity;

  function createController() {
    listController = $controller('ListController', {
      $scope: $scope
    });
  }

  function _mocks() {
    _mockRunService();

    _provide(function (_provide_) {
      provide = _provide_;

      _mockEntities();
      _mockSpAdminConfig();
      _mockListResponse();
      _mockState();
      _mockStateParams();
      _mockApiService();

      entity = {
        name: 'users',
        title: 'User',
        list: {
          sort: {
            defaultField: 'title',
            defaultOrder: 'asc'
          },
          pagination: {
            itemsPerPage: 10
          },
          httpConfig: {
            url: '/tests'
          }
        }
      };

      mockEntities.get.withArgs(entityName).returns(entity);
    });
  }

  function _mockListResponse() {
    mockListResponse = {parseListResponse: sinon.stub()};

    provide.value('listResponse', mockListResponse);
  }

  function _mockState() {
    mockState = {go: sinon.spy()};

    provide.value('$state', mockState);
  }

  function _mockStateParams() {
    mockStateParams = {
      page: 1,
      entityName: entityName
    };

    provide.value('$stateParams', mockStateParams);
  }

  function _mockApiService() {
    mockApiService = {
      httpEntity: sinon.stub()
    };

    provide.value('apiService', mockApiService);
  }

  function _mockEntities() {
    mockEntities = {
      get: sinon.stub()
    };

    provide.value('Entities', mockEntities);
  }

  function _mockSpAdminConfig() {
    mockSpAdminConfig = {
      updateTitle: sinon.spy()
    };

    provide.value('spAdminConfig', mockSpAdminConfig);
  }

  function _mockApiHttpEntity() {
    mockApiService.httpEntity.returns({success: sinon.spy()});
  }

  function _inject() {
     inject(function ($rootScope, _$controller_) {
       $scope = $rootScope.$new();
       $controller = _$controller_;
    });
  }

  function _setup() {
    _mocks();

    _inject();
  }

  beforeEach(function() {
    module('spAdmin');

    _setup();
  });

  it("entity", function() {
    _mockApiHttpEntity();

    createController();

    expect($scope.entity).to.be.eql(entity);
  });

  describe("pagination", function() {
    beforeEach(function() {
      _mockApiHttpEntity();
    });

    it("current page", function() {
      mockStateParams.page = 2;

      createController();

      expect($scope.pagination.currentPage).to.be.equal(mockStateParams.page);
    });

    it("items per page", function() {
      createController();

      expect($scope.pagination.itemsPerPage).to.be.equal(entity.list.pagination.itemsPerPage);
    });

    it("total pages", function() {
      //pagination directive bug
    });
  });

  it("page title", function() {
    _mockApiHttpEntity();

    createController();

    expect(mockSpAdminConfig.updateTitle.withArgs(entity.title).calledOnce).to.be.true;
    expect($scope.title).to.be.equal(entity.title);
  });

  describe("fill list", function(){
    it("url sort params", function() {
      mockStateParams.page = 2;
      mockStateParams.order_by = 'title2';
      mockStateParams.order = 'desc';

      var params = {page: 2, order_by: 'title2', order: 'desc'};

      _mockApiHttpEntity();

      createController();

      expect(mockApiService.httpEntity.withArgs(entity.name, entity.list.httpConfig, params).calledOnce).to.be.true;
    });

    it("default sort params", function() {
      mockStateParams.page = 2;

      var params = {page: 2, order_by: 'title', order: 'asc'};

      _mockApiHttpEntity();

      createController();

      expect(mockApiService.httpEntity.withArgs(entity.name, entity.list.httpConfig, params).calledOnce).to.be.true;
    });

    it("transform sort params", function() {
      entity.list.sort.transform = function(order_by, order) {
        expect(order_by).to.be.equal('title');
        expect(order).to.be.equal('asc');

        return {order_by: 'lastname'};
      };

      mockStateParams.page = 2;

      var params = {page: 2, order_by: 'title', order: 'asc'};

      _mockApiHttpEntity();

      createController();

      expect(mockApiService.httpEntity.withArgs(entity.name, entity.list.httpConfig, {page: 2, order_by: 'lastname'}).calledOnce).to.be.true;
    });

    it("fill list", function() {
      mockStateParams.page = 2;

      var mockHttpEntityResponse = {success: sinon.spy()};

      mockApiService.httpEntity.returns(mockHttpEntityResponse);

      var response = {};
      var status = {};
      var headers = {};

      var mockListResponseObj = {
        getTotalItems: sinon.stub(),
        getList: sinon.stub(),
        getHead: sinon.stub()
      };

      mockListResponseObj.getTotalItems.returns(1);
      mockListResponseObj.getList.returns(2);
      mockListResponseObj.getHead.returns(3);

      mockListResponse.parseListResponse.withArgs(response, status, headers, entity, {order_by: 'title', order: 'asc'}).returns(mockListResponseObj);

      createController();

      mockHttpEntityResponse.success.callArgWith(0, response, status, headers);

      expect($scope.pagination.total).to.be.equal(1);
      expect($scope.list).to.be.equal(2);
      expect($scope.listHead).to.be.equal(3);
    });

  });
});
