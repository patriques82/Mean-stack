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
