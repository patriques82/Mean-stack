// This service is for handling user requests (returns promises)
angular.module('common.services.userservice', [])

.factory('userService', ['$http', '$q', 'authService', function($http, $q, authService) {
  var userService = {};

  userService.all = function() {
    return $http.get('/api/user');
  };

  userService.create = function (userdata) {
    return $http.post('/api/user', userdata);
  };

  userService.login = function (userdata) {
    return $http.post('/api/login', userdata);
  };

  userService.isLoggedIn = function() {
    if (authService.getToken())
      return true;
    else
      return false;
  };

  userService.getCurrentUser = function() {
    var token = authService.getToken()
    if (token) {
      return $http.get('/api/me');
    } else {
      return $q.reject({ message: 'Obehöriga äger ej tillträde.' });
    }
  };

  userService.logout = function() {
    authService.clearToken();
    return;
  };

  return userService;

}]);
