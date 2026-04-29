const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const User = require('../models/User');

const resolveUserId = async (userRef) => {
  if (!userRef) {
    throw new Error('User reference is required')
  }

  if (mongoose.Types.ObjectId.isValid(userRef)) {
    return userRef
  }

  const user = await User.findOne({
    $or: [
      { name: userRef },
      { walletAddress: String(userRef).toLowerCase() },
    ],
  })

  if (!user) {
    throw new Error(`User not found: ${userRef}`)
  }

  return user._id
}

// @desc    Create a new expense
// @route   POST /api/expenses
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, paidBy, groupId, participants } = req.body;

    const paidById = await resolveUserId(paidBy);
    const splitEntries = Array.isArray(participants)
      ? await Promise.all(participants.map(async (user) => ({
          user: await resolveUserId(user),
          amount: amount / participants.length,
        })))
      : [];

    const expense = await Expense.create({
      title,
      amount,
      paidBy: paidById,
      participants: splitEntries.map(entry => entry.user),
      group: groupId,
      split: splitEntries,
    });

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all expenses for a group
// @route   GET /api/expenses/group/:groupId
exports.getGroupExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId })
      .populate('paidBy', 'name')
      .populate('split.user', 'name');

    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all expenses
// @route   GET /api/expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('paidBy', 'name')
      .populate('split.user', 'name')
      .populate('group', 'name');

    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Mark expense as settled (links to Web3 txHash)
// @route   PUT /api/expenses/:id/settle
exports.settleExpense = async (req, res) => {
  try {
    const { txHash } = req.body;
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { isSettled: true, txHash },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
