var mongoose = require('mongoose');
var kpi = require('./kpi');
var segment = require('./segment');
var categorySchema = require('./category');

//Schema for one or more contact persons that will be assigned to the SupplierSchema below
var ContactPersonSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  telnr: { type: Number, max: 20 },
  street: { type: String, required: true },
  zipcode: { type: String },
  city: { type: String, required: true },
  country: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date }
});

//The contract schema will be a part of the SupplierSchema below and will include the contrats that a supplier might have.
var ContractSchema = mongoose.Schema({
  serviceGrade: { type: String }
});

//The logistics schema will be a part of the SupplierSchema below. 
var LogisticsSchema = mongoose.Schema({
  creditTime: { type: Number, max: 1000 },
  deliveryMethod: { type: String },
  leadTime: { type: Number, max: 100 },
  numberOfArticles: { type: Number, max: 100000 }
});

//The sullpier address schema will be a part of the SupplierSchema below. 
var SupplierAddressSchema = mongoose.Schema({
  street: { type: String, required: true },
  zipcode: { type: String },
  city: { type: String, required: true },
  country: { type: String }
});

var SupplierSchema = mongoose.Schema({
  name: { type: String, required: true },
  orgnr: { type: String, required: true, unique: true },
  homepage_url: { type: String },
  supplierManager: { type: String },
  contacts: { type: [ContactPersonSchema] },
  segment: { type: mongoose.Schema.Types.ObjectId, ref: 'segment.bottomsegmentschema'},
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'categorySchema' },
  description: { type: String },
  address: { type: [SupplierAddressSchema]},
  rating: { type: Number, min: 1, max: 5 },
  created_at: { type: Date },
  updated_at: { type: Date }
});

// Update only created_at during creation of object,
// update updated_at everytime object gets modified
ContactPersonSchema.pre('save', function (next) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

// Update only created_at during creation of object,
// update updated_at everytime object gets modified
SupplierSchema.pre('save', function (next) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

// Check that email is valid regular expression
ContactPersonSchema.path('email').validate(function (value) {
  var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(value);
}, 'EmailErr');

module.exports = mongoose.model('Supplier', SupplierSchema);
