var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');

var UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  updated_at: { type: Date, default: Date.now }
});

// Hashes password before saving so the password is not out in the open.
UserSchema.pre('save', function(next) {
  var user = this;
  if(!user.isModified('password')) // only hash if modified
    return next;
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if(err)
      return next(err);
    user.password = hash; // changes the password -> hash
    next();
  });
});

// Helps to compare users passwords when logging in (Authentication)
UserSchema.methods.comparePasswords = function(password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);
};

// Check that password has a min-length of 8 chars
UserSchema.path('password').validate(function (value) {
    return /.{8,}/.test(value);
}, 'PasswordErr');

// Check that email is valid regular expression
UserSchema.path('email').validate(function (value) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(value);
}, 'EmailErr');

module.exports = mongoose.model('User', UserSchema);
