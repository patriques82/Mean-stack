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
