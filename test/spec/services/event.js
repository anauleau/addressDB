'use strict';

describe('Service: Event', function () {

  // load the service's module
  beforeEach(module('addressDbApp'));

  // instantiate service
  var Event;
  beforeEach(inject(function (_Event_) {
    Event = _Event_;
  }));
});
