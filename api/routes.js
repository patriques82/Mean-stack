var mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken'),
    config = require('../config.app');

// Controllers for specific resources
var UserController = require('./controllers/usercontroller'),
    SupplierController = require('./controllers/suppliercontroller');

// What environment? Prod or Dev
var ENV = process.argv[2] || 'dev';

// We define all routes here on the router given by server.js
// This is for separation of concerns only.
module.exports = function (router) {

  // Connection to DB depending on args to node
  var db = (ENV === 'prod') ? config.db.prod : config.db.dev;
  mongoose.connect(db, function(err) {
    if(err) {
      console.log('mongod: connection error: ' + err);
    } else {
      console.log('mongod: connection to ' + db + ' successfull');
    }
  });

  // PUBLIC ROUTES

  router.route('/login')
    // POST (login)
    .post(UserController.authenticate);

  // Route for suppliers
  router.route('/supplier')
    // GET (Read) all suppliers for user
    .get(SupplierController.list)
    // POST (Create) a new supplier
    .post(SupplierController.create);

    // Route for one supplier
  router.route('/supplier/:supplier_id')
    // GET (Read) one suppliers for user
    .get(SupplierController.get)

    //PUT (update) one supplier, find it på ID
    .put(SupplierController.getOneAndUpdateSupplier)

    //Delete one supplier by ID
    .delete(SupplierController.delete);

  // PRIVATE ROUTES

  // Middleware before private routes
  // Always verify the token before accessing the api routes
  router.use(function(req, res, next) {
    var token = req.body.token
             || req.headers['x-access-token']
    if(token) {
      jwt.verify(token, config.super_secret, function(err, decoded) {
        if(err) { // NO: False token
          return res.status(403).send({
            success: false,
            message: "Obehöriga äger ej tillträde."
          });
        } else { // Yes: Ok token (pass token on, on req param)
          req.decoded = decoded;
          next();
        }
      });
    } else { // NO: No token
      return res.status(403).send({
        success: false,
        message: "Obehöriga äger ej tillträde."
      });
    }
  });

  // Routes for users
  router.route('/user')
    // GET (Read) all users
    .get(UserController.list)
    // POST (Create) a new user
    .post(UserController.create);

  // Helper route to get user info
  router.route('/me')
    // GET (Read) user by token
    .get(UserController.me);

  return router;

};
