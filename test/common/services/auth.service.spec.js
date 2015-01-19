describe("auth service", function() {
  var authService;
  var mockApiService, mockSessionService, mockSpAdminConfig;

  function _mockApiService() {
    _provide(function (provide) {
      mockApiService = {
        http: sinon.stub()
      };

      provide.value('apiService', mockApiService);
    });
  }

  function _mockSpAdminConfig() {
    _provide(function (provide) {
      mockSpAdminConfig = {
        getOptions: sinon.stub()
      };

      provide.value('spAdminConfig', mockSpAdminConfig);
    });
  }

  function _mockSessionService() {
    _provide(function (provide) {
      mockSessionService = {
        get: sinon.stub(),
        create: sinon.spy()
      };

      provide.value('Session', mockSessionService);
    });
  }

  function _inject() {
    inject(function (_authService_) {
       authService = _authService_;
    });
  }

  function _setup() {
    _mockSpAdminConfig();
    _mockRunService();
    _mockApiService();
    _mockSessionService();

    _inject();
  }

  beforeEach(function() {
    module('spAdmin');

    _setup();
  });

  it("is authenticated", function() {
    mockSessionService.get.returns({});

    var isAuthenticated = authService.isAuthenticated();

    expect(isAuthenticated).to.be.true;

    mockSessionService.get.returns(false);

    isAuthenticated = authService.isAuthenticated();

    expect(isAuthenticated).to.be.false;
  });

  describe("login", function() {
    it("http post", function() {
      mockSpAdminConfig.getOptions.returns({authUrl: 'login'});
      mockApiService.http.returns({then: function(){}});

      var credentials = {
        'user': 'John'
      };

      var httpConfig = {
        data: credentials,
        url: 'login',
        method: 'POST'
      };

      authService.login(credentials);

      expect(mockApiService.http.withArgs(httpConfig).calledOnce).to.be.true;
    });

    it("succes http login, create session", function() {
      var thenSpy = sinon.spy();

      mockSpAdminConfig.getOptions.returns({authUrl: 'login'});
      mockApiService.http.returns({then: thenSpy});

      var credentials = {
        'user': 'John'
      };

      var httpConfig = {
        data: credentials,
        url: 'login',
        method: 'POST'
      };

      authService.login(credentials);

      var response = {
        data: {
          'id': 3,
          'user': 'John'
        }
      };

      thenSpy.callArgWith(0, response);

      expect(mockSessionService.create.withArgs(response.data).calledOnce).to.be.true;
    });


    it("override succes http response login", function() {
      var thenSpy = sinon.spy();

      var response = {
        data: {
          'id': 3,
          'user': 'John'
        }
      };

      var updatedResponse = {
        'id': 4,
        'user': 'John3'
      };

      mockSpAdminConfig.getOptions.returns({authUrl: 'login'});
      mockSpAdminConfig.overrideAuthResponseData = sinon.stub();
      mockSpAdminConfig.overrideAuthResponseData.withArgs(response).returns(updatedResponse);
      mockApiService.http.returns({then: thenSpy});

      var credentials = {
        'user': 'John'
      };

      var httpConfig = {
        data: credentials,
        url: 'login',
        method: 'POST'
      };

      authService.login(credentials);

      thenSpy.callArgWith(0, response);

      expect(mockSessionService.create.withArgs(updatedResponse).calledOnce).to.be.true;
    });
  });
});
