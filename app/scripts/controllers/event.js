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
  .controller('EventCtrl', function ($scope, Ref, user, $timeout, $q, $firebaseObject, $route, Event) {
     $scope.userProfile = $firebaseObject(Ref.child('users/' + user.uid));
     $scope.model = {};
     $scope.show = false;
     $scope.event = new Event(Ref.child('events/' + $route.current.params.id));
     $scope.event.$loaded().then(function(data){
        $scope.invitations = $scope.event.getInvitations(data.invitations);
        $scope.loaded = true;
     });
     $scope.sendRequest = function (params) {
         function createInvite() {
            var ref = Ref.child('/invitations'),
                def = $q.defer();
            var newInvite = ref.push({
                createdAt: Firebase.ServerValue.TIMESTAMP,
                owner: $scope.event.owner,
                name: params.name,
                email: params.email,
                ownerName: $scope.userProfile.firstName,
                eventID: $scope.event.id,
                sent: false,
                addressReceived: false
            }, function(err) {
                $timeout(function() {
                    if( err ) {
                        def.reject(err);
                    }
                    else {
                        def.resolve(newInvite.key());
                    }
                });
            });
            return def.promise;
         }
         function addInviteRef(id) {
            var ref = Ref.child('/invitations/' + id),
                def = $q.defer();
            ref.update({id: id}, function (err){
               $timeout(function(){
                  if (err) {
                      def.reject(err);
                  } else {
                      def.resolve(id);
                  }
               });
            });
            return def.promise;
         }
         function addInviteHook(id) {
            var ref = Ref.child('/events/' + $scope.event.id + '/invitations/' + id),
                def = $q.defer();
            ref.set(true, function (err){
               $timeout(function(){
                  if (err) {
                      def.reject(err);
                  } else {
                      def.resolve(id);
                  }
               });
            });
            return def.promise;
         }
         function iterateInvitationCount() {
             $scope.event.invitationCount += 1;
             return $scope.event.$save();
         }
         function updateInvitations() {
             $scope.invitations = $scope.event.getInvitations($scope.event.invitations);
         }
         function clearInputs() {
             $scope.model = {};
         }
       createInvite()
            .then(addInviteRef)
            .then(addInviteHook)
            .then(iterateInvitationCount)
            .then(updateInvitations)
            .then(clearInputs); 
     };
  });
