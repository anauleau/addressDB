'use strict';

describe('Service: Countries', function () {

  // load the service's module
  beforeEach(module('addressDbApp'));

  // instantiate service
  var Countries;
  beforeEach(inject(function (_Countries_) {
    Countries = _Countries_;
  }));
});
