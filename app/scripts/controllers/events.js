'use strict';

/**
 * @ngdoc function
 * @name addressDbApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the addressDbApp
 */
angular.module('addressDbApp')
  .controller('EventsCtrl', function ($scope, Auth, user, $location, $q, Ref, $timeout) {
      $scope.model = {};
      $scope.createEvent = function (event) {
          function createAddress() {
            var ref = Ref.child('events'), def = $q.defer(), users = {}, newEvent;
            users[user.uid] = true;
            newEvent = ref.push({
                name: event.name,
                owner: user.uid,
                createdAt: Firebase.ServerValue.TIMESTAMP,
                modifiedAt: Firebase.ServerValue.TIMESTAMP,
                users: users
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
             var ref = Ref.child('users/' + user.uid + '/addresses'), def = $q.defer(), hook = {};
             hook[eventID] = true;
             ref.set(hook, function(err) {
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
          createAddress()
            .then(addEventRef)
            .then(redirect, showError);
      };
      function redirect(eventID) {
        $location.path('/event/' + eventID);
      }
      function showError(err) {
        $scope.err = err;
      }
  });
