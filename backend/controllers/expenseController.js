const Expense = require('../models/Expense');

// @desc    Add an expense to a group
// @route   POST /api/expenses
exports.addExpense = async (req, res) => {
  try {
    const { description, amount, paidBy, groupId, split } = req.body;

    const expense = await Expense.create({
      description,
      amount,
      paidBy,
      group: groupId,
      split, // Array of { user, amount }
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
      .populate('paidBy', 'username')
      .populate('split.user', 'username');

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
