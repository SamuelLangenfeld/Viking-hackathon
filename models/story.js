var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var StorySchema = new Schema({
  sections: [{ body: { type: String, required: true }, author: { type: String, required: true } }],
  title: { type: String, required: true },
  maxSections: { type: Number, required: true, max: 10, min: 1 }

}, {
  timestamps: true
});

// Create the model with a defined schema
var Story = mongoose.model('Story', StorySchema);

module.exports = Story;