describe("api service", function() {
  var apiService;
  var mockHttpService, mockSessionService;

  function _inject() {
    inject(function (_apiService_) {
       apiService = _apiService_;
    });
  }

  function _setup() {
    _mockHttpService();
    _mockSessionService();

    _inject();
  }

  function _mockHttpService() {
    _provide(function (provide) {
      mockHttpService = sinon.stub();

      provide.value('$http', mockHttpService);
    });
  }

  function _mockSessionService() {
    _provide(function (provide) {
      mockSessionService = {
        get: sinon.stub()
      };

      provide.value('Session', mockSessionService);
    });
  }

  beforeEach(function() {
    module('spAdmin');

    _setup();
  });

  describe("join base url and path preventing double /", function() {
    it("add slash only to the base", function() {
      var base = "url/";
      var path = "path";

      var url = apiService.safeUrl(base, path);

      expect(url).to.be.equal("url/path");
    });

    it("add slash only to the path", function() {
      var base = "url";
      var path = "/path";

      var url = apiService.safeUrl(base, path);

      expect(url).to.be.equal("url/path");
    });

    it("add slash in path and base", function() {
      var base = "url/";
      var path = "/path";
      var url = apiService.safeUrl(base, path);

      expect(url).to.be.equal("url/path");
    });
  });

  describe("http", function() {
    it("http with config", function() {
      var config = {param: true};

      apiService.spAdminConfig = {
        overrideGlobalHttpConfig: false
      };

      mockHttpService.returns({
        error: sinon.spy()
      });

      apiService.http(config);

      expect(mockHttpService.withArgs(config).calledOnce).to.be.true;
    });

    it("set url", function() {
      var config = {param: true, url: 'test'};

      apiService.spAdminConfig = {
        overrideGlobalHttpConfig: false,
      };

      apiService.options = {
        baseUrl: 'baseurl'
      };

      mockHttpService.returns({
        error: sinon.spy()
      });

      apiService.safeUrl = sinon.stub();

      apiService.safeUrl.withArgs('baseurl', 'test').returns('safeurl');

      apiService.http(config);

      config.url = 'safeurl';

      expect(mockHttpService.withArgs(config).calledOnce).to.be.true;
    });

    it("override httpConfig", function() {
      var config = {param: true};
      var configOverrided = {param: false};
      var session = {user: 1};

      apiService.spAdminConfig = {
        overrideGlobalHttpConfig: sinon.stub()
      };

      mockSessionService.get.returns(session);

      apiService.spAdminConfig.overrideGlobalHttpConfig.withArgs(config, session).returns(configOverrided);

      mockHttpService.returns({
        error: sinon.spy()
      });

      apiService.http(config);

      expect(mockHttpService.withArgs(configOverrided).calledOnce).to.be.true;
    });

    it("error http calls", function() {
      var config = {param: true};
      var errorSpy = sinon.spy();

      apiService.spAdminConfig = {
        overrideGlobalHttpConfig: false
      };

      mockHttpService.returns({
        error: errorSpy
      });

      apiService.$q = {
        reject: sinon.spy()
      };

      apiService.$state = {
        go: sinon.spy()
      };

      apiService.http(config);

      errorSpy.callArgWith(0, {status: {index: 400}});

      expect(apiService.$q.reject.called).to.be.false;
    });

    it("unauthorized http calls", function() {
      var config = {param: true};
      var errorSpy = sinon.spy();

      apiService.spAdminConfig = {
        overrideGlobalHttpConfig: false
      };

      mockHttpService.returns({
        error: errorSpy
      });

      apiService.$q = {
        reject: sinon.spy()
      };

      apiService.$state = {
        go: sinon.spy()
      };

      apiService.http(config);

      errorSpy.callArgWith(0, {status: {index: 401}});

      expect(apiService.$q.reject.called).to.be.true;
      expect(apiService.$state.go.withArgs('login').calledOnce).to.be.true;
    });
  });

  describe("create", function() {
    it("create with defaults", function() {
      apiService.http = sinon.spy();

      var entity = {
        getBaseUrl: sinon.stub()
      };

      entity.getBaseUrl.returns('baseUrl');

      var config = {};
      var data = {};

      apiService.create(entity, data, config);

      var defaultHttpConfig = {
        url: 'baseUrl',
        data: {},
        method: 'POST'
      };

      expect(apiService.http.withArgs(defaultHttpConfig).calledOnce).to.be.true;
    });

    it("create with custom config", function() {
      apiService.http = sinon.spy();

      var entity = {
        getBaseUrl: sinon.stub()
      };

      entity.getBaseUrl.returns('baseUrl');

      var config = {url: 'testtest', method: 'GET'};
      var data = {data: true};

      apiService.create(entity, data, config);

      var httpConfig = {
        url: 'testtest',
        data: {data: true},
        method: 'GET'
      };

      expect(apiService.http.withArgs(httpConfig).calledOnce).to.be.true;
    });

    it("return http response", function() {
      apiService.http = sinon.stub();

      var mockHttpReturn = {httpReturn: true};
      apiService.http.returns(mockHttpReturn);

      var entity = {
        getBaseUrl: sinon.stub()
      };

      entity.getBaseUrl.returns('baseUrl');

      var result = apiService.create(entity);

      expect(result).to.be.equal(mockHttpReturn);
    });
  });

  describe("update", function() {
    it("update with defaults", function() {
      apiService.http = sinon.spy();

      var id = Math.floor((Math.random() * 100) + 1);
      var entity = {
        getBaseUrl: sinon.stub()
      };

      entity.getBaseUrl.returns('baseUrl');

      var config = {};
      var data = {};

      apiService.update(id, entity, data, config);

      var defaultHttpConfig = {
        url: 'baseUrl' + id,
        data: {},
        method: 'PUT'
      };

      expect(apiService.http.withArgs(defaultHttpConfig).calledOnce).to.be.true;
    });

    it("update with custom config", function() {
      apiService.http = sinon.spy();

      var id = Math.floor((Math.random() * 100) + 1);
      var entity = {
        getBaseUrl: sinon.stub()
      };

      entity.getBaseUrl.returns('baseUrl');

      var config = {url: 'testtest', method: 'GET'};
      var data = {data: true};

      apiService.update(id, entity, data, config);

      var httpConfig = {
        url: 'testtest',
        data: {data: true},
        method: 'GET'
      };

      expect(apiService.http.withArgs(httpConfig).calledOnce).to.be.true;
    });

    it("update return http response", function() {
      apiService.http = sinon.stub();

      var mockHttpReturn = {httpReturn: true};
      apiService.http.returns(mockHttpReturn);

      var id = Math.floor((Math.random() * 100) + 1);
      var entity = {
        getBaseUrl: sinon.stub()
      };

      entity.getBaseUrl.returns('baseUrl');

      var result = apiService.update(id, entity);

      expect(result).to.be.equal(mockHttpReturn);
    });
  });

  describe("getOne", function() {
    it("getOne with defaults", function() {
      apiService.http = sinon.spy();

      var id = Math.floor((Math.random() * 100) + 1);
      var entity = {
        getBaseUrl: sinon.stub()
      };

      entity.getBaseUrl.returns('baseUrl');

      var config = {};

      apiService.getOne(id, entity,config);

      var defaultHttpConfig = {
        url: 'baseUrl' + id
      };

      expect(apiService.http.withArgs(defaultHttpConfig).calledOnce).to.be.true;
    });

    it("getOne with custom config", function() {
      apiService.http = sinon.spy();

      var id = Math.floor((Math.random() * 100) + 1);
      var entity = {
        getBaseUrl: sinon.stub()
      };

      entity.getBaseUrl.returns('baseUrl');

      var config = {url: 'testtest', method: 'GET'};

      apiService.getOne(id, entity, config);

      var httpConfig = {
        url: 'testtest',
        method: 'GET'
      };

      expect(apiService.http.withArgs(httpConfig).calledOnce).to.be.true;
    });

    it("getOne return http response", function() {
      apiService.http = sinon.stub();

      var mockHttpReturn = {httpReturn: true};
      apiService.http.returns(mockHttpReturn);

      var id = Math.floor((Math.random() * 100) + 1);
      var entity = {
        getBaseUrl: sinon.stub()
      };

      entity.getBaseUrl.returns('baseUrl');

      var result = apiService.getOne(id, entity);

      expect(result).to.be.equal(mockHttpReturn);
    });
  });

  describe("httpEntity", function() {
    it("httpEntity with defaults", function() {
      apiService.http = sinon.spy();

      var entityName = 'entityName';
      apiService.httpEntity(entityName);

      var defaultHttpConfig = {
        url: entityName
      };

      expect(apiService.http.withArgs(defaultHttpConfig).calledOnce).to.be.true;
    });

    it("httpEntity with custom httpCongit", function() {
      apiService.http = sinon.spy();

      var entityName = 'entityName';

      var httpConfig = {
        url: entityName,
        data: {test:true}
      };

      apiService.httpEntity(entityName, httpConfig);

      expect(apiService.http.withArgs(httpConfig).calledOnce).to.be.true;
    });

    it("httpEntity with params", function() {
      apiService.http = sinon.spy();

      var entityName = 'entityName';

      var params = {
        'x': 1,
        'b': 20,
        'y': 3
      }

      var httpConfig = {
        url: entityName,
        data: {test:true},
        params: {'a': 1, 'b': 2, 'c': 3}
      };

      apiService.httpEntity(entityName, httpConfig, params);

      var expectHttpConfig = {
        url: entityName,
        data: {test:true},
        params: {
          'a': 1,
          'c': 3,
          'x': 1,
          'b': 20,
          'y': 3
        }
      };

      expect(apiService.http.withArgs(expectHttpConfig).calledOnce).to.be.true;
    });
  });

  describe("action", function() {
    it("action without params", function() {
      apiService.http = sinon.spy();

      var action = {
        httpConfig: {
          url: 'url',
          data: {test: true}
        }
      };

      apiService.action(action, 123);

      var expectHttpConfig = {
        url: 'url',
        data: {test: true},
        params: {
          ids: 123
        }
      };

      expect(apiService.http.withArgs(expectHttpConfig).calledOnce).to.be.true;
    });

    it("action with params", function() {
      apiService.http = sinon.spy();

      var action = {
        params: function() {
          return {test2: true}
        },
        httpConfig: {
          url: 'url',
          data: {test: true},
          params: {test1: true}
        }
      };

      apiService.action(action, 123);

      var expectHttpConfig = {
        url: 'url',
        data: {test: true},
        params: {test1: true, test2: true}
      };

      expect(apiService.http.withArgs(expectHttpConfig).calledOnce).to.be.true;
    });
  });
});
