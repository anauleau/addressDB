'use strict';
/**
 * @ngdoc function
 * @name addressDbApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('addressDbApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $route, $rootScope) {
    $rootScope.$route = $route;
    $scope.model = {};

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

    function redirect() {
      $location.path('/accounts');
    }

    function showError(err) {
      $scope.err = err;
    }
  });
