const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  agentId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  persona: {
    name: { type: String, required: true },
    domain: { type: String, required: true }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Agent', agentSchema);
