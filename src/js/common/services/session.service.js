angular.module('spAdmin')
.service('Session', function () {
  this.create = function (sessionData) {
    localStorage.setItem('sessionData', JSON.stringify(sessionData));
  };

  this.destroy = function () {
    localStorage.removeItem('sessionData');
  };

  this.get = function () {
    var sessionData = localStorage.getItem('sessionData');

    return JSON.parse(sessionData);
  };

  return this;
});
