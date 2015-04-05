(function(){
  "use strict";

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

angular.module('common', [
  'common.services.userservice',
  'common.services.supplierservice',
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

angular.module('common.services.supplierservice', [])


.factory('segmentFactory', [function () {
  var category = [
    'partner', 'föredragna', 'övriga'
  ];
  return category;
}])

.factory('categoryFactory', [function () {
  var segment = [
    'produktion', 'råmaterial', 'logistik', 'entreprenad', 'fastigheter', 'kontorsmaterial', 'IT'
  ];
  return segment;
}])

// TODO: Hook up this to supplier handling
// How to use
// var suppliers = suplierServiceNew.getSuppliers();
.factory('supplierServiceNew', ['$http', '$resource', function ($http, $resource) {
  var supplierService = {};

  //Get all suppliers
  supplierService.get = function () {
    return $http.get('/api/supplier');
  };

  //Get one supplier from params
  supplierService.getOne = function (supplier_id) {
    return $http.get('/api/supplier/' + supplier_id);
  }; 

  //Create new supplier
  supplierService.create = function (supplierdata) {
    return $http.post('/api/supplier', supplierdata);
  };

  //Delete supplier
  supplierService.delete = function (supplier_id) {
    return $http.delete('/api/supplier/' + supplier_id);
  }

  return supplierService;

}])


//Old static factory
.factory('supplierFactory', function () {
  //This adds some different suppliers as JSON objects in order fill the front-end with this data
  var suppliers = [
    {
      id: 1,
      name: 'Scan',
      segment: {
        'råmaterial' : true
      },
      supplierManager: 'Patrik Ackerfors',
      description: 'Scan levererar en massa grejor!',
      rating: 4,
      category: {
      	partner: false,
        'föredragna': true
      }
    },{
      id: 2,
      name: 'Lindvalls',
      segment: {
        'råmaterial' : true
      },
      supplierManager: 'Björn Nyckelgård',
      description: 'Lindvalls är grymma',
      rating: 3,
      category: {
      	partner: true
      }
    },{
      id: 3,
      name: 'Murbiten',
      segment: {
      	'produktion' : true
      },
      supplierManager: 'Camilla Vachet',
      description: 'De grymmaste murbitarna i stan',
      rating: 5,
      category: {
      	partner: true
      }
    },{
      id: 4,
      name: 'Wallenstam',
      segment: {
      	'logistik' : true
      },
      supplierManager: 'Patrik Nygren',
      description: 'Vi hyr ut till dig!',
      rating: 3,
      category: {
      	'övriga': true
      	}
      },{
      id: 5,
      name: 'Silent Order',
      segment: {
        'IT' : true
      },
      supplierManager: 'Björn Nyckelgård',
      description: 'Vi fixar den bästa pre-purchasing programvaran',
      rating: 5,
      category: {
        partner: true
      }
    },{
      id: 6,
      name: 'DHL',
      segment: {
        'logistik' : true
      },
      supplierManager: 'Patrik Ackerfors',
      description: 'Vi levererar i alla väder',
      rating: 3,
      category: {
        'föredragna': true
      }
    },{
      id: 7,
      name: 'Penthon',
      segment: {
        'entreprenad' : true
      },
      supplierManager: "John O'Neill",
      description: 'Vi fixar din grund',
      rating: 5,
      category: {
        partner: true
      }
    },{
      id: 8,
      name: 'Skanska',
      segment: {
        'entreprenad' : true
      },
      supplierManager: 'Patrik Ackerfors',
      description: 'Vi bygger dina hus till ett pra pris',
      rating: 2,
      category: {
        'övriga': true
      }
    },{
      id: 9,
      name: 'Arla',
      segment: {
        'råmaterial' : true
      },
      supplierManager: 'Camilla Vachet',
      description: 'Vi levererar alla mejerivaror du behöver!',
      rating: 4,
      category: {
        'föredragna': true
      }
    }
  ];
  return suppliers;
});

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

  // // Function for loading modal (login)
  // $scope.showLogin = function() {
  //   // Modal for login
  //   var loginModal = $modal.open({
  //     templateUrl: 'modules/navbar/partials/login-modal.tpl.html',
  //     controller: 'LoginController'
  //   });

  //   // function for when result gets back from registration
  //   loginModal.result.then(function(data) {
  //     $state.go("hem");
  //   });
  // };

}]);

angular.module('modules.navbar', [
  'navbar.controllers.navbarctrl'
]);


angular.module('suppliers.controllers', [])


.controller('SingleSupplierController', ['$scope', 'supplierServiceNew', '$stateParams', 'supplierFactory', 
  function ($scope, supplierServiceNew, $stateParams, supplierFactory) {
    $scope.suppliers = [];
    $scope.isReadonly = true;

    //list all suppliers
    supplierServiceNew.get()
    .success(function(data) {
      $scope.suppliers = data;
    })
    .error(function(err) {
    });

    //Get one supplier from state params and ID
    supplierServiceNew.getOne($stateParams.supplier_id)
    .success(function(data) {
      $scope.selectedSupplier = data;
    })
    .error(function(err) {
    });

    $scope.deleteSupplier = function(supplier_id) {
      supplierServiceNew.delete($stateParams.supplier_id)
      .success(function() {
      })
      .error(function(err) {
      });
    } 

  //$scope.suppliers = supplierFactory;
  //$scope.selectedSupplier = supplierFactory[$stateParams.leverantorID-1];
 

  // $scope.itemsPerPage = 4;
  // $scope.currentPage = 1;
  // $scope.pageCount = function () {
  //   console.log(Math.ceil($scope.suppliers.length / $scope.itemsPerPage));
  //   return Math.ceil($scope.suppliers.length / $scope.itemsPerPage);
  // };
  // $scope.suppliers.$promise.then(function () {
  //   $scope.totalItems = $scope.suppliers.length;
  //   $scope.$watch('currentPage + itemsPerPage', function() {
  //     var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
  //       end = begin + $scope.itemsPerPage;
  //     $scope.filteredFriends = $scope.friends.slice(begin, end);
  //     });
  //   });
  }
])

.controller('SupplierFormController', ['$scope', 'supplierServiceNew', 'categoryFactory', 'segmentFactory',
  function ($scope, supplierServiceNew, categoryFactory, segmentFactory) {

    $scope.category = categoryFactory;
    $scope.segment = segmentFactory;
    $scope.isReadonly = true;
    $scope.pagination = 5;

    $scope.createSupplier = function (supplierdata) {
      supplierServiceNew.create(supplierdata)
      .success( function (message) {
        $scope.message = message;
      })
      .error(function(err) {
        $scope.message = err;
      });
    };
  }
])

.controller('SupplierController', ['$scope', 'supplierServiceNew', 'supplierFactory', 'categoryFactory', 'segmentFactory',
  function ($scope, supplierServiceNew, supplierFactory, categoryFactory, segmentFactory) {
    // Suppliers list
    supplierServiceNew.get()
    .success(function(data) {
      $scope.suppliers = data;
    })
    .error(function(err) {
    });
    //$scope.suppliers = supplierFactory;
    $scope.category = categoryFactory;
    $scope.segment = segmentFactory;
    $scope.isReadonly = true;
    $scope.pagination = 5;
    $scope.showForm = false;
  }
]);

angular.module('modules.suppliers', ['suppliers.controllers'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('leverantorer', {
    url: '/leverantorer',
    views: {
      "main@": {
        controller: 'SupplierController',
        templateUrl: 'modules/suppliers/partials/suppliers.tpl.html'
      }
    }
  })

  .state('leverantorer.leverantor', {
    url: '/:supplier_id',
    views: {
      "main@": {
        controller: 'SingleSupplierController',
        templateUrl: 'modules/suppliers/partials/single-supplier.tpl.html',
        controllerAs: 'single'
      }
    }
  })

  ;
}])

.directive('supplierForm', function(){
    return {
      restrict: 'E',
      templateUrl: 'modules/suppliers/partials/supplier-form.tpl.html',
      replace: true,
      controller: 'SupplierFormController',
      scope: {
        books: '=',
        genres: '='
      }
    }
  })

.directive('supplierLabels', function(){
  return {
    restrict: 'E',
    templateUrl: 'modules/suppliers/partials/supplier-labels.tpl.html',
    scope: {
      category: '=',
      segment: '='
    }
  }
});

// //Makes breadcrumb resizeable
// $(document).ready(function(){
//     $(window).resize(function() {
//         ellipses1 = $("#bc1 :nth-child(2)")
//         if ($("#bc1 a:hidden").length >0) {ellipses1.show()} else {ellipses1.hide()}
//     })
// });
angular.module('user.controllers', [])

.controller('UserCtrl', ['$scope', 'userService', 'supplierServiceNew',
    function ($scope, userService, supplierServiceNew) {

  $scope.message = "testing, testing...";

  $scope.users = [];

  $scope.createSupplier = function (supplierdata) {
    supplierServiceNew.create(supplierdata)
    .success(function(message) {
      $scope.message = message;
    })
    .error(function(err) {
      $scope.message = err;
    });
  };

  // immediately executing function
  // Users list
  userService.all()
  .success(function(data) {
    $scope.users = data;
  })
  .error(function(err) {
  });

  // Suppliers list
  supplierServiceNew.get()
  .success(function(data) {
    $scope.suppliers = data;
  })
  .error(function(err) {
  });

}]);


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





angular.module('templates-main', []).run(['$templateCache', function($templateCache) {
  $templateCache.put("modules/home/partials/home.tpl.html",
    "<div class=container-fluid><div class=\"row row-offcanvas row-offcanvas-right\"><div class=\"col-xs-12 col-sm-10 col-sm-offset-1\"><div class=\"jumbotron text-center\"><h1>Hej {{currentUser.name || noname}}!</h1><p>Välkommen till O-viu's webb app</p></div></div></div></div>");
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
    "<div class=modal tabindex=-1 role=dialog><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=\"modal-title authform-header-content\">Login</h4><span type=button class=\"glyphicon glyphicon-remove pull-right authform-header-content\" id=authform-close data-dismiss=modal ng-click=loginDismiss()></span></div><div class=modal-body><form ng-submit=loginUser(user) name=loginForm novalidate><div class=\"alert alert-danger\" role=alert ng-show=\"failure && message\">{{message}}</div><div class=form-group><label for=user-email class=control-label>Email:</label><input class=form-control id=user-email name=userEmail ng-model=user.email placeholder=\"Din mail\"></div><div class=form-group><label for=user-password class=control-label>Lösenord:</label><input type=password class=form-control id=user-password name=userPassword ng-model=user.password placeholder=\"Ditt lösenord\"></div><button type=submit class=\"btn btn-primary\">Logga in</button></form></div><div class=modal-footer><button type=button class=\"btn btn-default\" data-dismiss=modal ng-click=loginDismiss()>Stäng</button></div></div></div></div>");
  $templateCache.put("modules/suppliers/partials/single-supplier.tpl.html",
    "<div class=container-fluid><div class=row><div class=\"col-sm-6 col-sm-offset-2\"><div id=bc1 class=\"btn-group btn-breadcrumb\"><a ui-sref=hem class=\"btn btn-default\"><i class=\"glyphicon icon-home\"></i></a> <a ui-sref=leverantorer class=\"btn btn-default\"><div>Leverantörer</div></a> <a class=\"active btn btn-default\"><div>{{selectedSupplier.name || \"Hittade ingen leverantör\"}}</div></a></div></div></div></div><div id=single-supplier class=container-fluid><div class=\"row row-offcanvas row-offcanvas-left\"><div class=\"hidden-xs col-sm-3 sidebar-offcanvas\" id=sidebarsuppliers><div class=card id=sokruta><hr><div class=\"input-group col-xs-12\"><input type=search class=form-control placeholder=\"Sök Leverantörer\" name=srch-term id=srch-term ng-model=search typeahead=\"supplier as supplier.title for supplier in suppliers | filter:$viewValue | limitTo:8\"><div class=input-group-btn><button class=\"btn btn-default\" type=submit><i class=\"glyphicon glyphicon-search\"></i></button></div></div><hr><div ng-repeat=\"supplier in suppliers | filter:search | orderBy:'title'\"><a ui-sref=\"leverantorer.leverantor({ supplier_id: supplier._id })\"><h2>{{supplier.name}}</h2></a><rating ng-model=supplier.rating max=5 data-readonly=isReadonly></rating><p>{{supplier.description}}</p></div></div></div><div class=\"col-xs-12 col-sm-8\"><div class=card><div class=row><div class=\"text-left col-xs-9\"><h1>{{selectedSupplier.name || \"Hittade ingen leverantör\"}}</h1></div><div class=\"text-right col-xs-3\"><button type=button ng-show=selectedSupplier ng-click=deleteSupplier(selectedSupplier.supplier_id) class=\"btn btn-danger text-right\">Ta bort leverantör</button></div></div><div class=row><div ng-show=selectedSupplier><div class=col-xs-12><div class=star2x><rating ng-model=singleSupplier.rating max=5 data-readonly=isReadonly state-on=\"'rating-selected'\" state-off=\"'rating'\"></rating></div><p>Leverantörsansvarig: {{selectedSupplier.supplierManager}}</p><hr><p>Beskrivning: {{selectedSupplier.description}}</p></div></div></div></div></div></div></div>");
  $templateCache.put("modules/suppliers/partials/supplier-form.tpl.html",
    "<form name=supplierForm ng-submit=\"SupplierFormController.createSupplier(supplierForm, SupplierFormController.supplier)\"><section class=\"row well live-preview hidden-xs\" ng-show=SupplierFormController.supplier.name><aside class=col-sm-3><img src=http://kortanyheter.se/wp-content/uploads/2014/02/SCAN-logga-690x401.png class=img-responsive alt=\"Responsive image\"><div class=\"star text-center\"><rating ng-model=SupplierFormController.supplier.rating max=5 data-readonly=isReadonly state-on=\"'rating-selected'\" state-off=\"'rating'\"></rating></div></aside><div class=col-sm-9><h3>{{SupplierFormController.supplier.name || \"Leverantörsnamn\"}}</h3><p><em>Beskrivning: &nbsp;</em>{{SupplierFormController.supplier.description || \"Leverantörsbeskrivning\"}}</p><p><em>Leverantörsansvarig: &nbsp;</em>{{SupplierFormController.supplier.supplierManager || \"Ingen leverantörsansvarig\"}}</p><ul class=\"list-unstyled fix-padding text-center\"><li ng-repeat=\"(categories, state) in SupplierFormController.supplier.category\" ng-show=state><button type=button class=\"btn btn-info btn-xs\">{{categories}}</button></li><li ng-repeat=\"(segments, state) in SupplierFormController.supplier.segment\" ng-show=state><button type=button class=\"btn btn-primary btn-xs\">{{segments}}</button></li></ul></div></section><div class=\"input-container col-xs-12 col-sm-10 col-md-8 col-sm-offset-1 col-md-offset-2\"><fieldset class=form-group><label for=name class=control-label>Leverantörsnamn:</label><span><input class=form-control id=name ng-model=SupplierFormController.supplier.name placeholder=\"Namnet på leverantören\"></span></fieldset><fieldset class=form-group><label for=description class=control-label>Beskrivning:</label><span><textarea id=description class=form-control cols=30 rows=3 ng-model=SupplierFormController.supplier.description placeholder=\"En kort beskrivning av leverantören\"></textarea></span></fieldset><fieldset class=form-group><label class=control-label for=supplierManager>Leverantörsansvarig:</label><span><input id=supplierManager class=form-control ng-model=SupplierFormController.supplier.supplierManager placeholder=\"Namn på vår leverantörsansvarig\"></span></fieldset><fieldset class=form-group><label for=rating class=control-label>Rating:</label><span><div class=star><rating ng-model=SupplierFormController.supplier.rating max=5 state-on=\"'rating-selected'\" state-off=\"'rating'\"></rating></div></span></fieldset><fieldset class=form-group><label class=control-label>Genre:</label><div class=genre><label ng-repeat=\"genre in genres\" for={{genre}} class=\"genre-label form-control\"><input type=checkbox name=genre id={{genre}} ng-model=\"SupplierFormController.supplier.genres[genre]\"> {{genre}}</label></div></fieldset><fieldset class=form-group><span class=\"col-lg-10 col-lg-offset-1 text-center\"><button class=\"btn btn-grey btn-lg btn-block\">Spara leverantör</button></span></fieldset></div></form>");
  $templateCache.put("modules/suppliers/partials/supplier-labels.tpl.html",
    "<ul class=\"list-unstyled fix-padding\"><li ng-repeat=\"(categories, state) in category\" ng-show=state><button type=button class=\"btn btn-info btn-xs\">{{categories}}</button></li><li ng-repeat=\"(segments, state) in segment\" ng-show=state><button type=button class=\"btn btn-primary btn-xs\">{{segments}}</button></li></ul>");
  $templateCache.put("modules/suppliers/partials/suppliers.tpl.html",
    "<div class=container-fluid><div class=row><div class=\"col-xs-12 col-sm-10 col-sm-offset-1\"><div class=\"jumbotron text-center\"><div id=containerIntro><p>Ni har totalt:&nbsp;&nbsp;</p><h1>{{suppliers.length}}</h1><p>&nbsp;&nbsp;leverantörer</p></div></div></div></div><div id=search-row class=row><div class=col-sm-1></div><div class=\"col-xs-12 col-sm-6 col-sm-offset-2\"><div class=text-center ng-show=SupplierController.showForm><h1>Lägg till leverantör</h1></div><div class=input-group ng-hide=SupplierController.showForm><input type=search class=form-control placeholder=\"Sök Leverantörer\" name=srch-term id=srch-term ng-model=search typeahead=\"supplier as supplier.title for supplier in suppliers | filter:$viewValue | limitTo:8\"><div class=input-group-btn><button class=\"btn btn-default\" type=submit><i class=\"glyphicon glyphicon-search\"></i></button></div></div></div><div class=\"col-sm-1 hidden-xs\"><button class=\"btn btn-grey\" ng-click=\"SupplierController.showForm = !SupplierController.showForm\"><span class=glyphicon style=vertical-align:left ng-class=\"{'glyphicon-chevron-down': SupplierController.showForm, 'glyphicon-chevron-right': !SupplierController.showForm}\"></span>{{SupplierController.showForm ? \" Avbryt\" : \" Lägg till leverantör\"}}</button></div><div class=\"col-xs-12 col-sm-8 col-sm-offset-2\"><supplier-form change-supplier-form=SupplierController.changeSupplierForm suppliers=SupplierController.suppliers ng-show=SupplierController.showForm></supplier-form></div></div><div class=row><div class=\"supplier-container col-xs-12 col-sm-10 col-sm-offset-1\"><div class=\"supplier-card col-xs-6 col-sm-4 col-md-3 col-lg-2\" ng-repeat=\"supplier in suppliers | filter:search | orderBy:'title'\" ui-sref=\"leverantorer.leverantor({ supplier_id: supplier._id })\"><div class=supplier-inner><div id=supplier-title><h4>{{supplier.name}}</h4><rating ng-model=supplier.rating max=5 data-readonly=true></rating><p>{{supplier.description}}</p></div><div id=supplier-category><supplier-labels category=supplier.category segment=supplier.segment></supplier-labels></div></div></div></div></div></div>");
  $templateCache.put("modules/user/partials/user.tpl.html",
    "<div class=container-fluid ng-controller=UserCtrl><div class=row><div class=\"col-xs-12 col-sm-10 col-sm-offset-1\"><div class=card><h1>Add supplier</h1><form ng-submit=createSupplier(supplier) name=supplierForm novalidate><input placeholder=Namn ng-model=supplier.name> <input placeholder=Orgnr ng-model=supplier.orgnr> <button type=submit>Add</button></form></div></div></div><div class=row><div class=\"col-sm-10 col-sm-offset-1\"><div class=col-sm-6><div class=card><h1>Users</h1><ul><li ng-repeat=\"user in users\">{{user.name}}</li></ul></div></div><div class=col-sm-6><div class=card><h1>Suppliers</h1><ul><li ng-repeat=\"s in suppliers\">{{s['name']}}</li></ul></div></div></div></div></div>");
}]);

}());
