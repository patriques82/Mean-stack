var mongoose = require('mongoose');

var supplyPrecision = mongoose.Schema({
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

var KpiSchema = mongoose.Schema({
});

module.exports = KpiSchema;