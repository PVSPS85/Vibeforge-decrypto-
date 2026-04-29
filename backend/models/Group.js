const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a group name'],
    trim: true,
  },
  emoji: { type: String, default: '✨' },
  tag: { type: String, default: 'Fun' },
  tagColor: { type: String, default: 'bg-cyan-500/20 text-cyan-300' },
  admin: {
    type: String, // Wallet address
    required: true,
    lowercase: true
  },
  members: [
    {
      type: String, // Wallet addresses
      lowercase: true
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Group', GroupSchema);
