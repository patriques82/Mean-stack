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