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
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  },
  split: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
