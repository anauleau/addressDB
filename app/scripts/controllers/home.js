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
    $scope.user = user;
    $scope.logout = function() { Auth.$unauth(); };
    $scope.addresses = [];
    $scope.userAddress = $firebaseObject(Ref);
    var profileRef = Ref.child('users/' + user.uid + '/addresses');
    var addressList = $firebaseObject(profileRef);
    $scope.addressList = [];
    
    addressList.$loaded().then(function () {
       angular.forEach(addressList, function (val, id){
           var addressRef = Ref.child('addresses/' + id);
           var address = $firebaseObject(addressRef);
           address.$loaded().then(function (){
              $scope.addressList.push(address);
           });
       });
    });
  });
