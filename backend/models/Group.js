const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, default: '' },
  description: { type: String, default: '' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  channels: [{ 
    name: { type: String, required: true },
    type: { type: String, enum: ['text', 'voice'], default: 'text' }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Group', groupSchema);
