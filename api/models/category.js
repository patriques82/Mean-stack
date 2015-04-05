var mongoose = require('mongoose');

var CategorySchema = mongoose.Schema({
  _id: { type: String }
});

module.exports = CategorySchema;