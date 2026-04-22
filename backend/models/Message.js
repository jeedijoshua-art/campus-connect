const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null },
  channel: { type: String, default: 'general' },
  fileUrl: { type: String, default: null }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
