/* global Firebase */
'use strict';

/**
 * @ngdoc function
 * @name addressDbApp.controller:NewaddressCtrl
 * @description
 * # NewaddressCtrl
 * Controller of the addressDbApp
 */
angular.module('addressDbApp')
  .controller('NewaddressCtrl', function ($scope, Auth, $location, user, $q, Ref, $timeout, States, Countries, $firebaseObject) {
      var profileRef = Ref.child('users/' + user.uid), profile;
      profile = $firebaseObject(profileRef);
      $scope.model = {};
      $scope.states = States;
      $scope.countries = Countries;
      // Set default country to USA
      $scope.model.country = $scope.countries[0];
      $scope.add = function (params) {
          addAddress()
            .then(addAddressHook)
            .then(redirect);

          function addAddress() {
            var ref = Ref.child('addresses'), def = $q.defer(), users = {}, newAddress;
            users[user.uid] = true;
            newAddress = ref.push({
                createdAt: Firebase.ServerValue.TIMESTAMP,
                modifiedAt: Firebase.ServerValue.TIMESTAMP,
                owner: user.uid,
                name: params.addressName,
                ownerName: profile.firstName + ' ' + profile.lastName,
                address1: params.address1,
                address2: params.address2,
                city: params.city,
                state: params.state,
                postalCode: params.postalCode,
                country: params.country.name,
                users: users
                }, function(err) {
                    $timeout(function() {
                        if( err ) {
                            def.reject(err);
                        } else {
                            def.resolve(newAddress.key());
                        }
                    });
                });
            return def.promise;
          }
          function addAddressHook(addressID) {
            var ref = Ref.child('users/' + user.uid + '/addresses/' + addressID), def = $q.defer();
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
          function redirect(){
              $location.path('/home');
          }
      };
  });
  