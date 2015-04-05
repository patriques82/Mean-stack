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
