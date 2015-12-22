'use strict';

/**
 * @ngdoc service
 * @name addressDbApp.NormalizedEvents
 * @description
 * # NormalizedEvents
 * Factory in the addressDbApp.
 */
angular.module('addressDbApp')
  .factory('NormalizedEvents', function(eventCache, $firebaseArray) {
    var Events = $firebaseArray.$extend({
            // override $$added to include users
            $$added: function(snapshot) {
                // call the super method
                var record = $firebaseArray.prototype.$$added.call(this, snapshot),
                    eventKey = snapshot.key();
                eventCache('events/' + eventKey).$load(eventKey).$loaded(function(eventData) {
                    record.eventData = eventData;
                });
                // return the modified record
                return record;
            }
        });
    return function(userRef) {
      return new Events(userRef);
    };
}).factory('eventCache', function ($firebaseObject) {
    return function (ref) {
        var cachedEvents = {};
        cachedEvents.$load = function (id) {
            if( !cachedEvents.hasOwnProperty(id) ) {
                cachedEvents[id] = $firebaseObject(ref);
            }
            return cachedEvents[id];
        };
        cachedEvents.$dispose = function () {
            angular.forEach(cachedEvents, function (event) {
                event.$destroy();
            });
        };
        cachedEvents.$remove = function(id) {
            delete cachedEvents[id];
            ref.child(id).remove();
        };
        return cachedEvents;
    };
});