class Entities {
  constructor() {
    this.entities = {};
  }
  add() {
    for (var i = 0, len = arguments.length; i < len; i++) {
      this.entities[arguments[i].name] = arguments[i];
    }
  }
  get(name) {
    return this.entities[name];
  }
  getAll() {
    return this.entities;
  }
}

angular.module('spAdmin').service('Entities', Entities);
