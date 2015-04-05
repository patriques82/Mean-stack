// This service is for intercepting all http requests and authenticate the user
angular.module('common.services.authinterceptorservice', [])

.factory('authInterceptorService', ['$q', '$injector', 'authService',
    function($q, $injector, authService) {
      var authInterceptorService = {};

      // Lets us intercept requests before they are sent
      // Gets the token and attaches to the header for the
      // server to verify the user
      authInterceptorService.request = function(config) {
        var token = authService.getToken();
        if(token) {
          config.headers['x-access-token'] = token;
        }
        return config;
      };

      // Lets us handle unauthorized requests (responseerrors)
      authInterceptorService.responseError = function(res) {
        if(res.status == 403) {
          authService.clearToken();
        }
        // return the errors from the server as a promise
        return $q.reject(res);
      };

      return authInterceptorService;
    }
]);
