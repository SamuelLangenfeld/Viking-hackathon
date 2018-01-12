var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var LatestStorySchema = new Schema({
  story: { type: Schema.Types.ObjectId, ref: "Story", required: true }

}, {
  timestamps: true
});

// Create the model with a defined schema
var LatestStory = mongoose.model('LatestStory', LatestStorySchema);

module.exports = LatestStory;