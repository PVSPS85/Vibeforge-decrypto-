const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: [true, 'Please add a display name'],
    trim: true,
  },
  appUid: {
    type: String,
    required: [true, 'Please add an app UID'],
    unique: true,
    uppercase: true,
  },
  walletAddress: {
    type: String,
    required: [true, 'Please add a wallet address'],
    unique: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
