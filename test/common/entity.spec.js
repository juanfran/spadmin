describe("Entity", function() {
  var Entity;

  function _inject() {
    inject(function (_Entity_) {
       Entity = _Entity_;
    });
  }

  function _setup() {
    _inject();
  }

  beforeEach(function() {
    module('spAdmin');

    _setup();
  });

  it("set entity title when is empty", function() {
    var entity = new Entity({name: 'users'});

    expect(entity.title).to.be.equal('users');
  });

  it("set list", function() {
    var entity = new Entity({name: 'users'});

    var list = [1, 2, 3];

    entity.setList(list);

    expect(entity.list).to.be.eql(list);
  });

  it("set add mode", function() {
    var entity = new Entity({name: 'users'});

    var add = [1, 2, 3];

    entity.setAdd(add);

    expect(entity.add).to.be.eql(add);
  });

  it("set edit mode", function() {
    var entity = new Entity({name: 'users'});

    var edit = [1, 2, 3];

    entity.setEdit(edit);

    expect(entity.edit).to.be.eql(edit);
  });

  describe("get base url", function() {
    it("custom url", function() {
      var url = "http://spadmin";

      var entity = new Entity({name: 'users', url: url});

      var baseurl = entity.getBaseUrl();

      expect(baseurl).to.be.equal(url);
    });

    it("url name based", function() {
      var entity = new Entity({name: 'users'});

      var baseurl = entity.getBaseUrl();

      expect(baseurl).to.be.equal('/users/');
    });
  });
});
