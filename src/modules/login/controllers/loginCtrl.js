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
