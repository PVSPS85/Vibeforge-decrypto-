const Expense = require('../models/Expense');

// @desc    Create a new expense
// @route   POST /api/expenses
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, category, paidBy, groupId, participants } = req.body;

    const splitEntries = Array.isArray(participants) && participants.length > 0
      ? participants.map(userWallet => ({
          user: userWallet.toLowerCase(),
          amount: amount / participants.length,
        }))
      : [];

    const expense = await Expense.create({
      title,
      amount,
      category: category || '💸 General',
      paidBy: paidBy.toLowerCase(),
      group: groupId, // Note: group is still ObjectId in schema, but this is fine to map directly
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
    const expenses = await Expense.find({ group: req.params.groupId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all expenses (for a specific user across all groups)
// @route   GET /api/expenses?wallet=0x...
exports.getExpenses = async (req, res) => {
  try {
    const wallet = req.query.wallet;
    let query = {};
    if (wallet) {
      const lowerWallet = wallet.toLowerCase();
      query = {
        $or: [
          { paidBy: lowerWallet },
          { "split.user": lowerWallet }
        ]
      };
    }
    const expenses = await Expense.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Mark expense as settled
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
