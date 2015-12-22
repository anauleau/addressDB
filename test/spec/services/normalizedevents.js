'use strict';

describe('Service: NormalizedEvents', function () {

  // load the service's module
  beforeEach(module('addressDbApp'));

  // instantiate service
  var NormalizedEvents;
  beforeEach(inject(function (_NormalizedEvents_) {
    NormalizedEvents = _NormalizedEvents_;
  }));

  it('should do something', function () {
    expect(!!NormalizedEvents).toBe(true);
  });

});
