describe("Field", function() {
  var Field;

  function _inject() {
    inject(function (_Field_) {
       Field = _Field_;
    });
  }

  function _setup() {
    _inject();
  }

  beforeEach(function() {
    module('spAdmin');

    _setup();
  });

  it("set option on the object construction", function() {
      var field = new Field({name: 'title'});

      expect(field.name).to.be.equal('title');
  });

  it("get default validation obj", function() {
    var defaultsValidation = {
      'minlength': 0,
      'maxlength': 99999
    };

    var field = new Field({name: 'title'});

    var result = field.validation();

    expect(result).to.be.eql(defaultsValidation);
  });

  it("set custom validation obj", function() {
    var validation = {
      'minlength': 1,
      'maxlength': 200,
      'required': true
    };

    var field = new Field({name: 'title', validation: validation});

    var result = field.validation();

    expect(result).to.be.eql(validation);
  })
});
