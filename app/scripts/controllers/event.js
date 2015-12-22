'use strict';

/**
 * @ngdoc function
 * @name addressDbApp.controller:EventCtrl
 * @description
 * # EventCtrl
 * Controller of the addressDbApp
 */
angular.module('addressDbApp')
  .controller('EventCtrl', function ($scope, Ref, $firebaseObject, $location) {
     var eventRef = Ref.child('events/' + $location.$$url.split('/')[2])
     $scope.event = $firebaseObject(eventRef);
  });
