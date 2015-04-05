(function(){
  "use strict";

/**
 * This file holds all front-end routing logic and is the entry point
 */
angular.module('app', [
  // External resources
  'ngResource',
  'ui.router',
  'ngAnimate',
  'ui.bootstrap',
  // Internal resources
  'templates-main',
  'common',
  'modules.navbar',
  'modules.home',
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

angular.module('common', [
  'common.services.userservice',
  'common.services.authservice',
  'common.services.authinterceptorservice'
]);

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
      return $q.reject({ message: 'Undenied access' });
    }
  };

  userService.logout = function() {
    authService.clearToken();
    return;
  };

  return userService;

}]);

angular.module('home.controllers', [])

.controller('HomeController', ['$scope', 'userService', function($scope, userService) {
    userService.getCurrentUser()
    .success(function(data) {
      $scope.currentUser = data;
    })
    .error(function(err) {
      $scope.currentUser = err;
    });
 }
]);

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

angular.module('login.controllers.loginctrl', [])

/*
 * This controller controls the loginform modal
 */
.controller('LoginController',
    ['$scope', '$state', '$modal', '$timeout', 'userService', 'authService',
    function ($scope, $state, $modal, $timeout, userService, authService) {

  // User posts registration form
  $scope.loginUser = function (user) {
    userService.login(user)
    .success(function (data) {
      if(!data.success) { // failure: (wrong password or email)
        $scope.failure = true;
        $scope.message = data.message; // pass message from server on to user
        $scope.user.password = '';
      } else { // success: store token
        authService.setToken(data.token);
        $state.go("hem");
      }
    })
    .error(function (err) {
      $scope.failure = true;
      $scope.message = "Något gick fel. Försök igen och kontakta support om felet kvarstår.";
    });
  };

  // Function for loading modal (registration)
  $scope.showRegistration = function () {
    // Modal for registration
    var regModal = $modal.open({
      templateUrl: 'modules/login/partials/registration-modal.tpl.html',
      controller: 'RegistrationController'
    });
    // function for when result gets back from registration
    regModal.result.then(function (data) {
      $state.go("hem");
    });
  };

}]);

angular.module('login.controllers.registrationctrl', [])

/*
 * This controller controls the registrationform modal
 */
.controller('RegistrationController',
    ['$scope', '$modalInstance', '$timeout', 'userService',
    function($scope, $modalInstance, $timeout, userService) {

  // To be filled in by the user through the form
  $scope.user = {};

  // Clear errors, reinsert data from user and mark appropriate errors
  $scope.reset = function(errorType) {
    $scope.regForm.$setPristine();
    $scope.user = $scope.copy; // put data back in form
    $scope.user.password = '';
    $scope.user.confirm = '';
    switch(errorType) { // Set appropriate error to display in form
      case "password":
        $scope.passworderror = true;
        break;
      case "mail":
        $scope.mailerror = true;
        break;
    }
  };

  // User posts registration form
  $scope.createUser = function(user) {
    $scope.copy = angular.copy(user); // put data back in form later
    userService.create(user)
    // success or user-mail is already registered, or incorrect password
    .success(function(data) {
      $scope.success = data.success; // false or true
      $scope.message = data.message; // alert message
      if(data.success) { // close modal in 2 sec if successfull registration
        $timeout(function() {
          $modalInstance.close('success');
        }, 2000);
      } else { // not successfull (mail was registered or password incorrect)
        $scope.reset(data.error);
      }
    })
    // Something went wrong with connection
    .error(function(err) {
        $scope.success = false;
        $scope.message = "Något gick fel. Försök igen och kontakta support om felet kvarstår.";
    });
  };

  // Closes modal if user cancels registration
  $scope.regDismiss = function() {
    $modalInstance.dismiss('cancel');
  };

}]);

angular.module('login.directives.passwordverify', [])

.directive('passwordVerify', function() {
  return {
    require: 'ngModel',
    restrict: 'A',
    scope: {
      passwordVerify: '='
    },
    link: function(scope, elem, attrs, ctrl) {
      scope.$watch(
        // value function returns the value being watched
        function() {
          var combined;
          if (scope.passwordVerify || ctrl.$viewValue) {
            combined = scope.passwordVerify + '_' + ctrl.$viewValue;
          }
          return combined;
        },
        // The listener function: Called only when the value from the current
        // combined and the previous call to combined are not
        // equal.
        function(value) {
          if (value) {
            ctrl.$parsers.unshift(function(viewValue) {
              var origin = scope.passwordVerify;
              if (origin !== viewValue) {
                ctrl.$setValidity("passwordVerify", false);
                return undefined;
              } else {
                ctrl.$setValidity("passwordVerify", true);
                return viewValue;
              }
            });
          }
        }
      );
    }

  };
});

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

angular.module('navbar.controllers.navbarctrl', [])

/**
 * This controller controls the navbar.
 */
.controller('NavbarCtrl', ['$scope', '$state', 'userService', 'authService', 
                          function($scope, $state, userService, authService) {

  // User logout
  $scope.logoutUser = function() {
    userService.logout();
    $state.go("login");
  };

}]);

angular.module('modules.navbar', [
  'navbar.controllers.navbarctrl'
]);


angular.module('templates-main', []).run(['$templateCache', function($templateCache) {
  $templateCache.put("modules/home/partials/home.tpl.html",
    "<div class=container-fluid><div class=\"row row-offcanvas row-offcanvas-right\"><div class=\"col-xs-12 col-sm-10 col-sm-offset-1\"><div class=\"jumbotron text-center\"><h1>Hello {{currentUser.name || noname}}!</h1><p>Welcome to Mean-stack app</p></div></div></div></div>");
  $templateCache.put("modules/login/partials/login.tpl.html",
    "<div class=container style=margin-top:40px><div class=row><div class=\"col-sm-6 col-md-4 col-md-offset-4\"><div class=\"panel panel-default\"><div class=panel-heading><strong>Logga in för att komma åt webbappen</strong></div><div class=panel-body><form class=form-signin ng-submit=loginUser(user) name=loginForm novalidate><div class=\"alert alert-danger\" role=alert ng-show=\"failure && message\">{{message}}</div><fieldset><div class=row><div class=center-block><img class=\"profile-img img-responsive\" src=http://suppliercloud.se/wp-content/uploads/2014/11/O-viu_logotplus_bluelight_rgbRETINA.png alt=\"\"></div></div><div class=row><div class=\"col-sm-12 col-md-10 col-md-offset-1\"><div class=form-group><div class=input-group><span class=input-group-addon>@</span> <input class=form-control id=user-email name=userEmail ng-model=user.email placeholder=namn@företag.se required autofocus></div></div><div class=form-group><div class=input-group><span class=input-group-addon><i class=\"glyphicon glyphicon-lock\"></i></span> <input type=password class=\"form-control col-xs-6\" id=user-password name=userPassword ng-model=user.password placeholder=Lösenord required></div></div><div class=form-group><input type=submit class=\"btn btn-lg btn-wind btn-block\" value=\"Logga in\"></div></div></div></fieldset></form></div><div class=panel-footer>Har du inget konto? <a href ng-click=showRegistration()>Registrera dig här</a></div></div></div></div></div>");
  $templateCache.put("modules/login/partials/registration-modal.tpl.html",
    "<div class=modal tabindex=-1 role=dialog><div class=\"modal-dialog modal-md\"><div class=modal-content><div class=\"modal-header text-center\"><h4 class=\"modal-title authform-header-content\">Registrera dig</h4><span type=button class=\"glyphicon glyphicon-remove pull-right authform-header-content\" id=authform-close data-dismiss=modal ng-click=regDismiss()></span></div><div class=modal-body><form ng-submit=createUser(user) name=regForm novalidate><div class=\"alert alert-success\" role=alert ng-show=\"success &&\n" +
    "            message\">{{message}}</div><div class=\"alert alert-danger\" role=alert ng-show=\"!success &&\n" +
    "            message\">{{message}}</div><div class=form-group ng-class=\"{ 'has-error' : regForm.userName.$invalid && regForm.$dirty }\"><div class=input-group><span class=input-group-addon><i class=\"glyphicon glyphicon-user\"></i></span> <input class=form-control id=user-name name=userName ng-model=user.name required placeholder=\"Ditt namn\"></div><p class=help-block ng-show=\"regForm.userName.$invalid && regForm.userName.$dirty\"><span>Du glömde ange ditt namn.</span></p></div><div class=form-group ng-class=\"{ 'has-error' : (regForm.userEmail.$invalid &&\n" +
    "            regForm.userEmail.$dirty) || (regForm.$submitted && !success) }\"><div class=input-group><span class=input-group-addon>@</span> <input type=email class=form-control id=user-email name=userEmail ng-model=user.email required placeholder=E-mail></div><p class=help-block ng-show=\"regForm.userEmail.$invalid &&\n" +
    "              regForm.userEmail.$dirty\"><span>Du måste ange en giltig epostadress.</span></p><p class=help-block ng-show=mailerror><span>Denna mail adress är redan registrerad.</span></p></div><div class=form-group ng-class=\"{ 'has-error' : regForm.userPassword.$invalid &&\n" +
    "            regForm.userPassword.$dirty || passworderror }\"><div class=input-group><span class=input-group-addon><i class=\"glyphicon glyphicon-lock\"></i></span> <input type=password class=form-control id=user-password name=userPassword ng-model=user.password ng-minlength=8 required placeholder=Lösenord></div><p class=help-block ng-show=\"regForm.userPassword.$invalid &&\n" +
    "              regForm.userPassword.$dirty || passworderror\"><span>Ditt lösenord måste innehålla minst 8 tecken.</span></p></div><div class=form-group ng-class=\"{ 'has-error' : regForm.userConfirm.$invalid &&\n" +
    "            regForm.userConfirm.$dirty }\"><div class=input-group><span class=input-group-addon>x2</span> <input type=password class=form-control id=user-confirm name=userConfirm ng-model=user.confirm password-verify=user.password required placeholder=\"Repetera lösenord\"></div><p class=help-block ng-show=regForm.userConfirm.$error.passwordVerify><span>Du angav inte samma lösenord som ovan.</span></p></div><div class=\"modal-footer text-center\"><button type=submit class=\"btn btn-block btn-lg btn-wind\">Registrera</button></div></form></div></div></div></div>");
  $templateCache.put("modules/navbar/partials/login-modal.tpl.html",
    "<div class=modal tabindex=-1 role=dialog><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=\"modal-title authform-header-content\">Login</h4><span type=button class=\"glyphicon glyphicon-remove pull-right authform-header-content\" id=authform-close data-dismiss=modal ng-click=loginDismiss()></span></div><div class=modal-body><form ng-submit=loginUser(user) name=loginForm novalidate><div class=\"alert alert-danger\" role=alert ng-show=\"failure && message\">{{message}}</div><div class=form-group><label for=user-email class=control-label>Email:</label><input class=form-control id=user-email name=userEmail ng-model=user.email placeholder=\"Din mail\"></div><div class=form-group><label for=user-password class=control-label>Password:</label><input type=password class=form-control id=user-password name=userPassword ng-model=user.password placeholder=\"Ditt lösenord\"></div><button type=submit class=\"btn btn-primary\">Login</button></form></div><div class=modal-footer><button type=button class=\"btn btn-default\" data-dismiss=modal ng-click=loginDismiss()>Close</button></div></div></div></div>");
}]);

}());
