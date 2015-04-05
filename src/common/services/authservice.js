// This service is for handling user requests (returns promises)
angular.module('common.services.authservice', [])

.factory('authService', ['$window', function($window) {
  var authService = {};

  authService.getToken = function() {
    return $window.localStorage.getItem('signature');
  };

  authService.setToken = function(token) {
    $window.localStorage.setItem('signature', token);
  };

  authService.clearToken = function() {
    $window.localStorage.removeItem('signature');
  };

  return authService;

}]);
