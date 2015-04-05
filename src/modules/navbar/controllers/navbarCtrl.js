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
