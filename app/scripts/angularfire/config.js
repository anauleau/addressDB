angular.module('firebase.config', [])
  .constant('FBURL', 'https://addressdb.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password','facebook','google'])

  .constant('loginRedirectPath', '/login');
