describe("listResponse service", function() {
  var listResponseService;

  function _inject() {
    inject(function (_listResponse_) {
       listResponseService = _listResponse_;
    });
  }

  function _setup() {
    _inject();
  }

  beforeEach(function() {
    module('spAdmin');

    _setup();
  });

  describe("formatResponse", function() {
    var response = [
        {id: 2},
        {id: 3}
    ];

    var entity = {
      list: {
        pagination: {
          totalPages: sinon.stub()
        }
      }
    };

    var pages = 3;

    entity.list.pagination.totalPages.withArgs(response).returns(pages);

    it("response with pagination", function() {
      var status = {};
      var headers = {};
      var result = listResponseService.formatResponse(response, status, headers, entity);

      expect(result.items).to.be.equal(response);
      expect(result.totalItems).to.be.equal(pages);
    });

    it("override response", function() {
      var status = {};
      var headers = {};
      var newList = [
        {xx: 1},
        {xx: 22}
      ];

      entity.list.overrideResponse = sinon.stub();
      entity.list.overrideResponse.withArgs(response, status, headers).returns(newList);

      var result = listResponseService.formatResponse(response, status, headers, entity);

      expect(result.items).to.be.equal(newList);
    });


    it("map response", function() {
      var status = {};
      var headers = {};
      entity.list.map = function() {
        return {'x': 1};
      };

      var result = listResponseService.formatResponse(response, status, headers, entity);

      expect(result.items).to.be.eql([ { x: 1 }, { x: 1 } ]);
    });
  });

  describe("generateHeader", function() {
    var fieldsConfiguration = [
      {key: 'name', label: 'Name'},
      {key: 'lastname', label: 'Lastname'},
      {key: 'age', label: 'Age'}
    ];

    var sort = {
      order_by: 'lastname',
      order: 1
    };

    var entity = {
      list: {
        sort: {
          fields: ['lastname', 'age']
        }
      }
    };

    it("get header fields array", function() {
      var header = [
        {label: 'Name', key: 'name', sortable: false, order: ''},
        {label: 'Lastname', key: 'lastname', sortable: true, order: 1},
        {label: 'Age', key: 'age', sortable: true, order: ''}
      ];

      var result = listResponseService.generateHeader(fieldsConfiguration, sort, entity);

      expect(result).to.be.eql(result);
    });
  });

  describe("generateFieldsConfigurations", function() {
    it("custom fiends included", function() {
      var entity = {
        list: {
          include: [
            'field1',
            {key: 'field2', label: 'Field2', link: true},
            'field3'
          ]
        }
      };

      var expectedResult = [
        {key: 'field1', label: 'field1', link: false},
        {key: 'field2', label: 'Field2', link: true},
        {key: 'field3', label: 'field3', link: false}
      ];

      var result = listResponseService.generateFieldsConfigurations([], entity);

      expect(result).to.be.eql(expectedResult);
    });

    it("autogenerate header", function() {
      var entity = {list: {}};
      var list = [
        {name: 'john', age: '37'},
        {name: 'george', age: '4'}
      ];

      var expectedResult = [
        {key: 'age', label: 'age', link: true},
        {key: 'name', label: 'name', link: false}
      ];

      var result = listResponseService.generateFieldsConfigurations(list, entity);

      expect(result).to.be.eql(expectedResult);
    });

    it("autogenerate header with excludes", function() {
      var entity = {
        list: {
          exclude: ['lastname', 'age']
        }
      };

      var list = [
        {name: 'john', lastname: 'xx', age: '37'},
        {name: 'george', lastname: 'yy', age: '4'}
      ];

      var expectedResult = [
        {key: 'name', label: 'name', link: true}
      ];

      var result = listResponseService.generateFieldsConfigurations(list, entity);

      expect(result).to.be.eql(expectedResult);
    });
  });

  describe("generateRows", function(){
    it("entity info", function() {
      var list = [
        {id: 1, name: 'john'},
        {id: 2, name: 'george'}
      ];

      var fieldsConfiguration = [
        {key: 'id'},
        {key: 'name'}
      ];

      var entity = {
        identifier: 'id',
        name: 'Users',
        list: {}
      };

      var result = listResponseService.generateRows(list, fieldsConfiguration, entity);

      expect(result[0].entity.identifier).to.be.equal(list[0].id);
      expect(result[0].entity.name).to.be.equal(entity.name);
    });

    it("normal fields", function() {
      var list = [
        {id: 1, name: 'john'},
        {id: 2, name: 'george'}
      ];

      var fieldsConfiguration = [
        {key: 'id'},
        {key: 'name'}
      ];

      var entity = {
        identifier: 'id',
        name: 'Users',
        list: {}
      };

      var result = listResponseService.generateRows(list, fieldsConfiguration, entity);

      var field = result[0].fields[1];

      expect(field.value).to.be.equal(list[0].name);
      expect(field.config.key).to.be.equal('name');
      expect(field.config.template).to.have.length.above(2);
    });

    it("override field value", function() {
      var list = [
        {id: 1, name: 'john'},
        {id: 2, name: 'george'}
      ];

      var fieldsConfiguration = [
        {key: 'id'},
        {key: 'name', override: function(item) {
          expect(item.id).to.be.defined;
          expect(item.name).to.be.defined;

          return 'george';
        }}
      ];

      var entity = {
        identifier: 'id',
        name: 'Users',
        list: {}
      };

      var result = listResponseService.generateRows(list, fieldsConfiguration, entity);

      var field = result[0].fields[1];

      expect(field.value).to.be.equal('george');
      expect(field.config.key).to.be.equal('name');
      expect(field.config.template).to.have.length.above(2);
    });

    it("override field value by entity configuration", function() {
      var list = [
        {id: 1, name: 'john'},
        {id: 2, name: 'george'}
      ];

      var fieldsConfiguration = [
        {key: 'id'},
        {key: 'name'}
      ];

      var entity = {
        identifier: 'id',
        name: 'Users',
        list: {
          override: function(key, value) {
            var expectedKey = key === 'id' || key === 'name';

            expect(expectedKey).to.be.true;
            expect(value).to.be.defined;

            return 'arthur';
          }
        }
      };

      var result = listResponseService.generateRows(list, fieldsConfiguration, entity);

      var field = result[0].fields[1];

      expect(field.value).to.be.equal('arthur');
      expect(field.config.key).to.be.equal('name');
      expect(field.config.template).to.have.length.above(2);
    });
  });

  describe("parseListResponse", function() {
    var result, totalItems, head, list;

    beforeEach(function() {
      var response = { list: [1, 2, 3] };
      var status = {};
      var headers = {};
      var entity = {title: 'fake'};
      var sort = {title: 'asc'};
      var items = [1, 2, 3];
      var fieldsConfiguration = {key: 'title'};

      totalItems = 200;

      head = [{
        label: 'title',
        key: 'title',
        sortable: false
      }];

      list = [{
        entity: {indentifier: 'fake'},
        fields: ['title']
      }];

      listResponseService.formatResponse = sinon.stub();
      listResponseService.formatResponse.withArgs(response, status, headers, entity).returns({items: items, totalItems: totalItems});

      listResponseService.generateFieldsConfigurations = sinon.stub();
      listResponseService.generateFieldsConfigurations.withArgs(items, entity).returns(fieldsConfiguration);

      listResponseService.generateHeader = sinon.stub();
      listResponseService.generateHeader.withArgs(fieldsConfiguration, sort, entity).returns(head);

      listResponseService.generateRows = sinon.stub();
      listResponseService.generateRows.withArgs(items, fieldsConfiguration, entity).returns(list);

      result = listResponseService.parseListResponse(response, status, headers, entity, sort);
    });

    it("get total items", function() {
      var totalItemsResult = result.getTotalItems();

      expect(totalItemsResult).to.be.equal(totalItems);
    })

    it("get list", function() {
      var listResult = result.getList();

      expect(listResult).to.be.eql(list);
    });

    it("get head" , function() {
      var headResult = result.getHead();

      expect(headResult).to.be.eql(head);
    });
  });
});
