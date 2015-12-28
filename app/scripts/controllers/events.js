/* global Firebase */
'use strict';

/**
 * @ngdoc function
 * @name addressDbApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the addressDbApp
 */
angular.module('addressDbApp')
  .controller('EventsCtrl', function ($scope, Auth, user, $location, $q, Ref, $timeout, $firebaseArray, $route, $rootScope) {
      $rootScope.$route = $route;
      $scope.model = {};
      $scope.events = [];
      var eventsRef = Ref.child('events');
      $scope.events = $firebaseArray(eventsRef.orderByChild('owner').startAt(user.uid).endAt(user.uid));
      
      $scope.createEvent = function (event) {
          function createAddress() {
            var ref = Ref.child('events'), def = $q.defer(), users = {}, newEvent;
            users[user.uid] = true;
            newEvent = ref.push({
                name: event.name,
                owner: user.uid,
                createdAt: Firebase.ServerValue.TIMESTAMP,
                modifiedAt: Firebase.ServerValue.TIMESTAMP,
                users: users,
                invitationCount: 0,
                addressCount: 0
            }, function(err) {
                $timeout(function() {
                    if( err ) {
                        def.reject(err);
                    } else {    
                        def.resolve(newEvent.key());
                    }
                });
            });
            return def.promise;
          }
          function addEventRef (eventID) {
             var ref = Ref.child('users/' + user.uid + '/events'), def = $q.defer(), hook = {};
             hook[eventID] = true;
             ref.update(hook, function(err) {
               $timeout(function() {
                  if( err ) {
                     def.reject(err);
                  } else {
                    def.resolve(eventID);
                  }
                });
             });
             return def.promise;
          }
          function addEventKey (eventID) {
             var ref = Ref.child('events/' + eventID), def = $q.defer();
             ref.update({id: eventID}, function(err) {
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
          createAddress()
            .then(addEventRef)
            .then(addEventKey)
            .then(clearInput, showError);
      };
      $scope.redirect = function(eventID) {
        $location.path('/event/' + eventID);
      };
      function clearInput() {
          $scope.model.name = '';
      }
      function showError(err) {
        $scope.err = err;
      }
  });
