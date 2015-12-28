'use strict';

/**
 * @ngdoc service
 * @name addressDbApp.NormalizedEvents
 * @description
 * # NormalizedEvents
 * Factory in the addressDbApp.
 */
angular.module('addressDbApp').factory('UserFactory', function(Ref, $firebaseObject, Address) {
    return $firebaseObject.$extend({
        getAddresses: function(addressIDs) {
            var addresses = [];
            angular.forEach(addressIDs, function(val, id){
               var eventRef = Ref.child('/addresses/' + id);
               var address = new Address(eventRef);
               addresses.push(address);
            });
            return addresses;
        },
        getEvents: function(eventIDs) {
            var events = [];
            angular.forEach(eventIDs, function(val, id){
               var eventRef = Ref.child('/events/' + id);
               events.push($firebaseObject(eventRef)); 
            });
            return events;
        } 
    });
});
