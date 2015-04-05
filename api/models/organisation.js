var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');

// Update created time only during creation
var updateTime = function(next) {
  var now = new Date();
  if(!this.created_at) {
    this.created_at = now;
  }
  next();
};

// Organisation Schema

var OrgSchema = mongoose.Schema({
  name: { type: String, required: true },
  creator: { type: UserSchema, required: true },
  admins: [UserSchema],
  editors: [UserSchema],
  viewers: [UserSchema],
  suppliers: [SupplierSchema],
  created_at: { type: Date },
  updated_at: { type: Date, default: Date.now }
});

OrgSchema.pre('save', updateTime);



// Suppliers

var SupplierSchema = mongoose.Schema({
  name: { type: String, required: true },
  orgnr: { type: String, required: true, unique: true },
  homepage_url: { type: String },
  contacts: [ContactPersonSchema],
  created_at: { type: Date },
  updated_at: { type: Date, default: Date.now }
});

SupplierSchema.pre('save', updateTime);

var ContactPersonSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  telnr: { type: Number, max: 20 }
  created_at: { type: Date },
  updated_at: { type: Date }
  updated_at: { type: Date, default: Date.now }
});

ContactPersonSchema.pre('save', updateTime);



// Creators, Admins, Editors, Viewers

var UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  org: { type: String },
  password: { type: String, required: true },
  created_at: { type: Date },
  updated_at: { type: Date, default: Date.now }
});

// Hashes password before saving so the password is not out in the open.
UserSchema.pre('save', function(next) {
  var user = this;
  if(!user.isModified('password')) // only hash if modified
    return updateTime(next);
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if(err)
      return next(err);
    user.password = hash; // changes the password -> hash
    updateTime(next);
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



