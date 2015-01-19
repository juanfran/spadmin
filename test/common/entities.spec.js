describe("Entities", function() {
  var Entities;

  function _inject() {
    inject(function (_Entities_) {
       Entities = _Entities_;
    });
  }

  function _setup() {
    _inject();
  }

  beforeEach(function() {
    module('spAdmin');

    _setup();
  });

  it("add entities", function(){
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

    var entity3 = {
      identifier: 'id',
      name: 'users3',
      title: 'User'
    };

    Entities.add(entity1, entity2, entity3);

    var expectResult = {};
    expectResult[entity1.name] = entity1;
    expectResult[entity2.name] = entity2;
    expectResult[entity3.name] = entity3;

    expect(Entities.entities).to.be.eql(expectResult);
  });


  it("get entity by name", function(){
    var entity1 = {
      identifier: 'id',
      name: 'users1',
      title: 'User'
    };

    Entities.entities[entity1.name] = entity1;

    expect(Entities.get('users1')).to.be.eql(entity1);
  });

  it("get all entities", function(){
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

    var entity3 = {
      identifier: 'id',
      name: 'users3',
      title: 'User'
    };

    Entities.entities[entity1.name] = entity1;
    Entities.entities[entity2.name] = entity2;
    Entities.entities[entity3.name] = entity3;

    expect(Entities.getAll()).to.be.eql(Entities.entities);
  });
});
