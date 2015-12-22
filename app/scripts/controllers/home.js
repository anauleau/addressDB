'use strict';

/**
 * @ngdoc function
 * @name addressDbApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the addressDbApp
 */
angular.module('addressDbApp')
  .controller('HomeCtrl', function ($scope, user, Auth, Ref, $firebaseObject) {
    $scope.logout = function() { Auth.$unauth(); };
    var profileRef = Ref.child('users/' + user.uid);
    $scope.profile = $firebaseObject(profileRef);
    $scope.profile.$loaded(function (data){
        $scope.address = $firebaseObject(Ref.child('addresses/' + Object.keys(data.addresses)[0]));
    });
  });
