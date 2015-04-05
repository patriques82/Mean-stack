angular.module('modules.home', ['home.controllers'])

.config(['$stateProvider', function($stateProvider) {

  $stateProvider.state('hem', {
    url: '/hem',
    views: {
      'main@': {
        controller: 'HomeController',
        templateUrl: 'modules/home/partials/home.tpl.html'
      }
    }
  });
}]);
