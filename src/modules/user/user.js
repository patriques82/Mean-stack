angular.module('modules.user', [
    'ui.router',
    'user.controllers'
])

.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/hem');

  $stateProvider.state('anvandare', {
    url: '/anvandare',
    views: {
      'main': {
        controller: 'UserCtrl',
        templateUrl: 'modules/user/partials/user.tpl.html'
      }
    }
  });

}]);




