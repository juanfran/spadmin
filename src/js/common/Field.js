class Field {
  constructor(options={}) {
    options.validation = options.validation || {};

    this._validationConfig = _.clone(options.validation);

    delete options.validation;

    Object.assign(this, options);

    this.defaultsValidation = {
      'minlength': 0,
      'maxlength': 99999
    };

  }
  validation() {
    return _.defaults(this._validationConfig, this.defaultsValidation);
  }
}

angular.module('spAdmin').factory('Field', function() {
  return Field;
});
