'use strict';

/**
 * @ngdoc service
 * @name addressDbApp.Event
 * @description
 * # Event
 * Factory in the addressDbApp.
 */
angular.module('addressDbApp')
  .factory('Event', function (Ref, $firebaseObject) {
      return $firebaseObject.$extend({
          getInvitations: function (inviationIDs) {
              var invitations = [];
            angular.forEach(inviationIDs, function(val, id){
               var inviteRef = Ref.child('/invitations/' + id);
               invitations.push($firebaseObject(inviteRef));
            });
            return invitations;
          }
      });
  });
