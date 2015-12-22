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
  .controller('RegisterCtrl', function ($scope, Auth, $location, $q, Ref, $timeout, States, Countries) {
    $scope.model = {};
    $scope.states = States;
    $scope.countries = Countries;
    // Set default country to USA
    $scope.model.country = $scope.countries[0];

    $scope.oauthLogin = function(provider) {
      $scope.err = null;
      Auth.$authWithOAuthPopup(provider, {rememberMe: true}).then(redirect, showError);
    };

    $scope.anonymousLogin = function() {
      $scope.err = null;
      Auth.$authAnonymously({rememberMe: true}).then(redirect, showError);
    };

    $scope.passwordLogin = function(email, pass) {
      $scope.err = null;
      Auth.$authWithPassword({email: email, password: pass}, {rememberMe: true}).then(
        redirect, showError
      );
    };

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
          .then(createAddress)
          .then(addAddressHook)
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

      function createAddress(user) {
        var ref = Ref.child('addresses'), def = $q.defer(), users = {}, newAddress;
        users[user.uid] = true;
        newAddress = ref.push({
            createdAt: Firebase.ServerValue.TIMESTAMP,
            modifiedAt: Firebase.ServerValue.TIMESTAMP,
            owner: user.uid,
            address1: params.address1,
            address2: params.address2,
            city: params.city,
            state: params.state,
            postalCode: params.postalCode,
            country: params.country.name,
            users: users
            }, function(err) {
          $timeout(function() {
            if( err ) {
              def.reject(err);
            }
            else {
              def.resolve(newAddress.key());
            }
          });
        });
        return def.promise;
      }

      function addAddressHook(addressId) {
          var ref = Ref.child('users/' + userId + '/addresses/' + addressId), def = $q.defer();
          ref.set(true, function(err) {
          $timeout(function() {
            if( err ) {
              def.reject(err);
            }
            else {
              def.resolve();
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
      $location.path('/home');
    }

    function showError(err) {
      $scope.err = err;
    }


  });
