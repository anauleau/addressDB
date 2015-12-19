'use strict';

describe('Controller: NewrequestCtrl', function () {

  // load the controller's module
  beforeEach(module('addressDbApp'));

  var NewrequestCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewrequestCtrl = $controller('NewrequestCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
