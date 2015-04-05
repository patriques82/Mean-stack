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

