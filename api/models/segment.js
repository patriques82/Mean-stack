var mongoose = require('mongoose');

var BottomSegmentSchema = mongoose.Schema({
  _id: { type: String }
});

var SubSegmentSchema = mongoose.Schema({
  name: { type: String },
  BottomSegments: { type: [BottomSegmentSchema] }
});

var TopSegmentSchema = mongoose.Schema({
  name: { type: String},
  subSegments: { type: [SubSegmentSchema] }
});

module.exports.bottomsegmentschema = BottomSegmentSchema;
module.exports.subsegment = mongoose.model('SubSegment', SubSegmentSchema);
module.exports.topsegment = mongoose.model('TopSegment', TopSegmentSchema);