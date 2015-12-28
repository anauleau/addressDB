'use strict';

/**
 * @ngdoc function
 * @name addressDbApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the addressDbApp
 */
angular.module('addressDbApp')
  .controller('HomeCtrl', function ($scope, user, Auth, Ref, $firebaseObject, UserFactory, $route, $rootScope) {
    $rootScope.$route = $route;
    var profileRef = Ref.child('users/' + user.uid);
    $scope.profile = new UserFactory(profileRef);
    $scope.profile.$loaded(function (data){
        $scope.addresses = $scope.profile.getAddresses(data.addresses);
        $scope.events = $scope.profile.getEvents(data.events);
    });
  });
