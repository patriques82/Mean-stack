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
