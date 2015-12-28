'use strict';

/**
 * @ngdoc service
 * @name addressDbApp.Address
 * @description
 * # Address
 * Factory in the addressDbApp.
 */
angular.module('addressDbApp')
  .factory('Address', function (Ref, $firebaseObject) {
    return $firebaseObject.$extend({
       getOwnerName: function (ownerID) {
           var ref = Ref.child('/users/' + ownerID);
           $firebaseObject(ref).$loaded().then(function(user) {
              if (user.anon) {
                  return user.alias;
              } else {
                  return user.firstName + user.lastName;
              }
           });
       }
    });
  });
