/**
 * This file holds all front-end routing logic and is the entry point
 */
angular.module('supplierApp', [
  // External resources
  'ngResource',
  'ui.router',
  'ngAnimate',
  'ui.bootstrap',
  // Internal resources
  'templates-main',
  'common',
  'modules.navbar',
  'modules.suppliers',
  'modules.home',
  'modules.user',
  'modules.login'
])

// TODO: Use Modernizr to see if browser has: Localstorage, and other stuff that
// application requires, if not display message to upgrade browser to
// appropriate version.

// This controller mainly controlls authentication of the app and what resources
// the user is allowed to see if logged in or not.
.controller('mainCtrl', ['$rootScope', '$state', '$location', 'userService',
  function($rootScope, $state, $location, userService) {

    // All child scopes have access to isLoggedIn variable
    $rootScope.isLoggedIn = userService.isLoggedIn();

    // For all state changes check if user is logged in
    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams) {
        $rootScope.isLoggedIn = userService.isLoggedIn();
        if (!userService.isLoggedIn()) {
          $location.path('/login');
        }
      }
    );
  }
])


// Configuration of application
.config(['$locationProvider', '$httpProvider', '$urlRouterProvider',
  function($locationProvider, $httpProvider, $urlRouterProvider) {
    // enable html5Mode for pushstate ('#'-less URLs)
    $locationProvider.html5Mode(true);
    // attach our auth interceptor to all the http requests
    $httpProvider.interceptors.push('authInterceptorService');
  }
]);
