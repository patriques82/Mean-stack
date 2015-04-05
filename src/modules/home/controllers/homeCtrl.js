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
