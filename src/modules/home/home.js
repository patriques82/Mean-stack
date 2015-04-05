angular.module('modules.home', ['home.controllers'])

.config(['$stateProvider', function($stateProvider) {

  $stateProvider.state('home', {
    url: '/home',
    views: {
      'main@': {
        controller: 'HomeController',
        templateUrl: 'modules/home/partials/home.tpl.html'
      }
    }
  });
}]);
