/* global Firebase */
'use strict';

/**
 * @ngdoc function
 * @name addressDbApp.controller:EventCtrl
 * @description
 * # EventCtrl
 * Controller of the addressDbApp
 */
angular.module('addressDbApp')
  .controller('EventCtrl', function ($scope, Ref, event, invitations, user, $timeout, $q, $firebaseObject) {
     $scope.userProfile = $firebaseObject(Ref.child('users/' + user.uid));
     $scope.model = {};
     $scope.show = false;
     $scope.event = event;
     $scope.event.$loaded().then(function(){
        $scope.loaded = true;
     });
     $scope.invitations = invitations;
     $scope.sendRequest = function (params) {
         // create invite in event
         function createInvite () {
             var ref = Ref.child('events/' + $scope.event.$id + '/invitations'),
                def = $q.defer(),
                invite;
            invite = ref.push({
                createdAt: Firebase.ServerValue.TIMESTAMP,
                name: params.name,
                email: params.email,
                addressReceived: false
            }, function(err) {
                $timeout(function() {
                    if( err ) {
                        def.reject(err);
                    }
                    else {
                        def.resolve(invite.key());
                    }
                });
            });
            return def.promise;
         }
         function addInvite(id) {
            var ref = Ref.child('/invitations/' + id),
                def = $q.defer();
            ref.update({
                createdAt: Firebase.ServerValue.TIMESTAMP,
                owner: event.owner,
                name: params.name,
                email: params.email,
                id: id,
                ownerName: $scope.userProfile.firstName,
                eventID: event.id,
                sent: false,
                addressReceived: false
            }, function(err) {
                $timeout(function() {
                    if( err ) {
                        def.reject(err);
                    }
                    else {
                        def.resolve();
                    }
                });
            });
            return def.promise;
         }
         function clearInputs() {
             $scope.model = {};
         }
       createInvite()
            .then(addInvite)
            .then(clearInputs); 
     };
  });
