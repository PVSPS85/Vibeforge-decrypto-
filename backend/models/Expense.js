const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
  },
  category: { type: String, default: '💸 General' },
  paidBy: {
    type: String, // Wallet Address
    required: true,
    lowercase: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  },
  split: [
    {
      user: { type: String, lowercase: true }, // Wallet Address
      amount: { type: Number, required: true },
    }
  ],
  isSettled: {
    type: Boolean,
    default: false,
  },
  txHash: {
    type: String, // For Web3 on-chain settlement tracking
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Expense', ExpenseSchema);
