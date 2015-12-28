/* global Firebase */
'use strict';

/**
 * @ngdoc function
 * @name addressDbApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the addressDbApp
 */
angular.module('addressDbApp')
  .controller('RegisterCtrl', function ($scope, Auth, $location, $q, Ref, $timeout, $route, $rootScope) {
    $rootScope.$route = $route;
    $scope.model = {};

    $scope.createAccount = function(params, confirm) {
      var userId;
      $scope.err = null;
      if( !params.pass ) {
        $scope.err = 'Please enter a password';
      }
      else if( params.pass !== confirm ) {
        $scope.err = 'Passwords do not match';
      }
      else {
        Auth.$createUser({email: params.email, password: params.pass})
          .then(function () {
            // authenticate so we have permission to write to Firebase
            return Auth.$authWithPassword({email: params.email, password: params.pass}, {rememberMe: true});
          })
          .then(createProfile)
          .then(redirect, showError);
      }

      function createProfile(user) {
        var ref = Ref.child('users/' + user.uid), def = $q.defer(), newProfileObj;
            newProfileObj = {
                id: user.uid,
                email: params.email,
                createdAt: Firebase.ServerValue.TIMESTAMP,
                modifiedAt: Firebase.ServerValue.TIMESTAMP,
                name: firstPartOfEmail(params.email),
                firstName: params.firstName,
                lastName: params.lastName
            };
        ref.update(newProfileObj, function(err) {
          $timeout(function() {
            if( err ) {
              def.reject(err);
            }
            else {
              userId = user.uid;
              def.resolve(user);
            }
          });
        });
        return def.promise;
      }
    };

    function firstPartOfEmail(email) {
      return ucfirst(email.substr(0, email.indexOf('@'))||'');
    }

    function ucfirst (str) {
      // inspired by: http://kevin.vanzonneveld.net
      str += '';
      var f = str.charAt(0).toUpperCase();
      return f + str.substr(1);
    }

    function redirect() {
      $location.path('/newAddress');
    }

    function showError(err) {
      $scope.err = err;
    }


  });
