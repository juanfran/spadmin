class Entity {
  constructor(options={}) {
    if (!options.title) {
      options.title = options.name;
    }

    Object.assign(this, options);
  }
  setList(list) {
    this.list = Object.freeze(list);
  }
  setAdd(add) {
    this.add = Object.freeze(add);
  }
  setEdit(edit) {
    this.edit = Object.freeze(edit);
  }
  getBaseUrl() {
    if (this.url) {
      return this.url;
    } else {
      return '/'+ this.name + '/';
    }
  }
}

angular.module('spAdmin').factory('Entity', function() {
  return Entity;
});
