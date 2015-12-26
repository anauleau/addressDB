'use strict';

describe('Controller: InviteCtrl', function () {

  // load the controller's module
  beforeEach(module('addressDbApp'));

  var InviteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InviteCtrl = $controller('InviteCtrl', {
      $scope: scope
    });
  }));

});
