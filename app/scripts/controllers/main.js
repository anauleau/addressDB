'use strict';

/**
 * @ngdoc function
 * @name addressDbApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the addressDbApp
 */
angular.module('addressDbApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
