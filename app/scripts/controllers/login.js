'use strict';
/**
 * @ngdoc function
 * @name addressDbApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('addressDbApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $q, Ref, $timeout, $routeParams, States, Countries) {
    $scope.model = {};
    $scope.states = States;
    $scope.countries = Countries;
    // Set default country to USA
    $scope.model.country = $scope.countries[0]; 
    $scope.createMode = $routeParams.register === 'true' ? true : false;

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
        var ref = Ref.child('users'), def = $q.defer(), newProfileObj = {};
            newProfileObj[user.uid] = {
                id: user.uid,
                email: params.email,
                name: firstPartOfEmail(params.email),
                firstName: params.firstName,
                lastName: params.lastName
            };
        ref.set(newProfileObj, function(err) {
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
            createdAt: new Date(),
            name: params.addressName,
            email: params.email,
            address1: params.address1,
            address2: params.address2,
            city: params.city,
            state: params.state,
            postalCode: params.postalCode,
            country: params.country,
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
          var ref = Ref.child('users/' + userId + '/addresses'), def = $q.defer(), hook = {};
          hook[addressId] = true;
          ref.set(hook, function(err) {
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
      $location.path('/account');
    }

    function showError(err) {
      $scope.err = err;
    }


  });
