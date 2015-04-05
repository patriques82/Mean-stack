var express = require('express'),
    server = express(),
    mongoose = require('mongoose'),
    config = require('./config.app'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    path = require('path'),
    methodOverride = require('method-override'); // for heroku

// Middleware
// parse post requests
server.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
server.use(bodyParser.json());

// Allow server to handle CORS
server.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});

// Log
server.use(logger('dev'));
server.set('view engine', 'ejs');
server.use(express.static(__dirname + '/public'));

// For management of files (Needs to run Grunt to compile first)
var includeFiles = {
  scripts: config.lib_files.scripts.concat(config.bin_files.scripts),
  styles: config.lib_files.styles.concat(config.bin_files.styles)
};

var router = express.Router(),
    apiRoutes = require('./api/routes')(router);
// Use api for routes prepended with api
server.use('/api', apiRoutes);

// Single Page App (this route handles all other requests (catchall))
server.all('/*', function(req, res, next) {
  // Just send the index.html for other files to support HTML5Mode
  res.render('index', includeFiles); // looks by default in views
});

// Conncetion
var port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log("Listening on " + port);
});
