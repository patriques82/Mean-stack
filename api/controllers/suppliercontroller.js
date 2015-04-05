var Supplier = require('../models/supplier');

// Lists all suppliers
module.exports.list = function(req, res, next) {
  Supplier.find({}, function(err, suppliers) {
    if(err)
      return next(err);
    else
      res.json(suppliers);
  });
};

// Lists one suppliers
module.exports.get = function(req, res, next) {
  //var supplierId = ObjectId.fromString( req.params.supplier_id );
  Supplier.findById(req.params.supplier_id, function (err, post) {
    if (err) {
      return next(err);
    }
    res.json(post);
  });
};

// get one supplier and update the info
module.exports.getOneAndUpdateSupplier = function(req, res, next) {
  console.log("supplier_id: within suppliercontroller" + req.params.supplier_id);
  // use our supplier model to find the supplier we want
  Supplier.findById(req.params.supplier_id, function (err, supplier) {
    if (err) {
      return next(err);
    }

    if (req.body.name) 
      supplier.name = req.body.name; // update the supplier name
    if (req.body.orgnr) 
      supplier.orgnr = req.body.orgnr; // update the supplier orgnr
    if (req.body.homepage_url) 
      supplier.homepage_url = req.body.homepage_url; // update the supplier homepage url
    if (req.body.supplierManager) 
      supplier.supplierManager = req.body.supplierManager; // update the supplier manager
    if (req.body.description) 
      supplier.description = req.body.description; // update the supplier description
    if (req.body.rating) 
      supplier.rating = req.body.rating; // update the supplier description

    // save the supplier
    supplier.save(function (err) {
    if (err) {
      return next(err);
    }
    res.json({ message: 'Supplier uppdaterad!' });
    });
  });
};

// Create a new supplier
module.exports.create = function(req, res, next) {
  var supplierdata = {
    name: req.body.name,
    orgnr: req.body.orgnr,
    homepage_url: req.body.homepage_url,
    supplierManager: req.body.supplierManager,
    description: req.body.description,
    rating: req.body.rating
  };
  var supplier = new Supplier(supplierdata);
  supplier.save(function(err, result) {
    if(err) { // Failure
      return res.json({
        success: false,
        message: "Något gick fel, tyvärr!"
      });
    } else { // Success
      return res.json({
        success: true,
        message: "Leverantör skapades!"
      });
    }
  });
};

//Remove supplier by ID
module.exports.delete = function(req, res, next) {
  Supplier.remove({
      _id: req.params.supplier_id
  }, function (err, supplier) {
      if (err) {
        return next(err);
      }
    res.json({ message: 'Leverantör borttagen' });
  });
};
