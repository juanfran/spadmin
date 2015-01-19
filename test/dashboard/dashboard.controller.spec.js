describe("dashboard controller", function() {
  var dashboardController;
  var mockEntities, mockSpAdminConfig;

  var entity1 = {
    identifier: 'id',
    name: 'users1',
    title: 'User'
  };

  var entity2 = {
    identifier: 'id',
    name: 'users2',
    title: 'User'
  };

  var entities = {};
  entities[entity1.name] = entity1;
  entities[entity2.name] = entity2;

  function _mockEntities() {
    _provide(function (provide) {
      mockEntities = {
        getAll:  sinon.stub()
      };

      provide.value('Entities', mockEntities);

      mockEntities.getAll.returns(entities);
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

  function _inject() {
     inject(function ($controller) {
      $scope = {};
      dashboardController = $controller('DashboardController', {
        $scope: $scope
      });
    });
  }

  function _setup() {
    _mockEntities();
    _mockSpAdminConfig();
    _mockRunService();


    _inject();
  }

  beforeEach(function() {
    module('spAdmin');

    _setup();
  });

  it("set entities in the dasboard scope", function() {
    expect($scope.dashboard).to.be.instanceof(Array);
    expect($scope.dashboard[0]).to.be.eql(entity1);
    expect($scope.dashboard[1]).to.be.eql(entity2);
  });

  it("set dashboard title", function() {
    expect(mockSpAdminConfig.updateTitle.withArgs('Dashboard').calledOnce).to.be.true;
  });
});
