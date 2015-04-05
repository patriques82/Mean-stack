angular.module('modules.login', [
	'login.controllers.loginctrl',
	'login.controllers.registrationctrl',
	'login.directives.passwordverify'
	])

.config(['$stateProvider', function($stateProvider) {

  $stateProvider.state('login', {
    url: '/login',
    views: {
      'main@': {
        controller: 'LoginController',
        templateUrl: 'modules/login/partials/login.tpl.html'
      }
    }
  });
}]);
