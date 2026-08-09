const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  id: { 
    type: String, 
    default: () => new mongoose.Types.ObjectId().toString(), 
    unique: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  text: { 
    type: String, 
    required: true 
  },
  rationale: { 
    type: String, 
    required: true 
  },
  sources: [{ 
    type: String 
  }]
});

// Override the default toJSON method to match the API specification exactly
postSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    // Return only the fields requested in the specification
    return {
      id: ret.id,
      createdAt: ret.createdAt,
      text: ret.text,
      rationale: ret.rationale,
      sources: ret.sources
    };
  }
});

module.exports = mongoose.model('Post', postSchema);
