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
  .controller('EventCtrl', function ($scope, Ref, event, invitations, $timeout) {
     $scope.model = {};
     $scope.show = false;
     $scope.event = event;
     $scope.event.$loaded().then(function(){
        $scope.loaded = true;
     });
     $scope.invitations = invitations;
     $scope.sendRequest = function (params) {
         var ref = Ref.child('events/' + $scope.event.$id + '/invitations');
         ref.push({
            createdAt: Firebase.ServerValue.TIMESTAMP,
            name: params.name,
            email: params.email,
            addressReceived: false
         }, function(err) {
          $timeout(function() {
            if( err ) {
              console.log(err);
            }
            else {
              $scope.model = {};
            }
          });
        });
     };
  });
