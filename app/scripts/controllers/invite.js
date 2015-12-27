'use strict';

/**
 * @ngdoc function
 * @name addressDbApp.controller:InviteCtrl
 * @description
 * # InviteCtrl
 * Controller of the addressDbApp
 */
angular.module('addressDbApp')
  .controller('InviteCtrl', function ($scope, invitation, Ref, $q, $timeout) {
      $scope.userid;
      $scope.submit = function (params) {
          createAnonUser()
            .then(addAddress)
            .then(addOwnerHook)
            .then(addHostHook)

          function createAnonUser() {
              var ref = Ref.child('users'),
                def = $q.defer(),
                newAnonUser;
              newAnonUser = ref.push({
                  anon: true,
                  email: invitation.email,
                  alias: invitation.name
              }, function(err) {
                  $timeout(function(){
                     if(err) {
                         def.reject(err);
                     } else {
                         $scope.userid = newAnonUser.key();
                         def.resolve(newAnonUser.key());
                     }
                  });
              });
              return def.promise;
          }
          function addAddress(userID) {
              var ref = Ref.child('addresses'),
                def = $q.defer(),
                newAddress,
                users = {};
              users[userID] = true;
              users[invitation.owner] = true;
              newAddress = ref.push({
                createdAt: Firebase.ServerValue.TIMESTAMP,
                modifiedAt: Firebase.ServerValue.TIMESTAMP,
                owner: userID,
                address1: params.address1,
                address2: params.address2,
                city: params.city,
                state: params.state,
                postalCode: params.postalCode,
                country: params.country.name,
                users: users
              }, function(err) {
                  $timeout(function(){
                     if(err) {
                         def.reject(err);
                     } else {
                         def.resolve(newAddress.key());
                     }
                  });
              });
              return def.promise;
          }
          function addOwnerHook(addressID) {
            var ref = Ref.child('users/' + $scope.userId + '/addresses/' + addressID), def = $q.defer();
            ref.set(true, function(err) {
                $timeout(function() {
                    if( err ) {
                        def.reject(err);
                    } else {
                        def.resolve();
                    }
                });
            });
            return def.promise;
         }
         function addHostHook(addressID) {
            var ref = Ref.child('users/' + invitation.owner + '/addresses/' + addressID), def = $q.defer();
            ref.set(true, function(err) {
                $timeout(function() {
                    if( err ) {
                        def.reject(err);
                    } else {
                        def.resolve();
                    }
                });
            });
            return def.promise;
         }
      };
  });
