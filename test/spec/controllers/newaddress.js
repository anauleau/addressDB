'use strict';

describe('Controller: NewaddressCtrl', function () {

  // load the controller's module
  beforeEach(module('addressDbApp'));

  var NewaddressCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewaddressCtrl = $controller('NewaddressCtrl', {
      $scope: scope
    });
  }));
});
