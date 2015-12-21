'use strict';

/**
 * @ngdoc function
 * @name addressDbApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the addressDbApp
 */
angular.module('addressDbApp')
  .controller('EventsCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
