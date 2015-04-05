var User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    config = require('../../config.app');

// Lists all users
module.exports.list = function(req, res) {
  User.find({}, function(err, users) {
    if(err)
      return next(err);
    else
      return res.json(users);
  });
};

// Get current user from (req.params)
module.exports.me = function(req, res) {
  // return res.send(req.decoded);
  return res.json(req.decoded);
};

// Creates a user
module.exports.create = function(req, res) {
  var userdata = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };
  var user = new User(userdata);
  user.save(function (err, result) {
    if(err) {
      if(err.code == 11000) { // not unique password
        return res.json({
          success: false,
          userdata: userdata,
          error: "mail",
          message: req.body.email + " is already occupied."
        });
      } else if(err.errors.password) { // not min-lenght 8 on password
        return res.json({
          success: false,
          userdata: userdata,
          error: "password",
          message: "Too weak password."
        });
      } else { // something else went wrong, investigate
        return res.json({
          success: false,
          userdata: userdata,
          error: "unknown",
          message: "Something went wrong during validation. Please try again."
        });
      }
    } else { // Success!
      return res.json({
        success: true,
        message: "Successfull registration!"
      });
    }
  });
};

// Authenticates a user
// Data on Success: { success user token }
// Data on Failure: { success message }
module.exports.authenticate = function(req, res) {
  User.findOne({
    email: req.body.email
  })
  .select('name email password')
  .exec(function(err, user) {
    if(err) throw err;
    if(!user) { // No user found (Security: do not display that fact)
      res.json({
        success: false,
        message: "Wrong email or password."
      });
    } else if(user) {
      var validPassword = user.comparePasswords(req.body.password);
      if(!validPassword) { // Not valid password
        res.json({
          success: false,
          message: "Wrong email or password."
        });
      } else {
        var token = jwt.sign({
            name: user.name,
            email: user.email
          }, config.super_secret, {
            expiresInMinutes: 1440 // 24 h TODO: specify
          });
        res.json({
          success: true,
          user: user,
          token: token
        });
      }
    }
  });
};

