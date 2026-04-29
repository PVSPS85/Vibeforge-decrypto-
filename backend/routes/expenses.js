const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpenses,
  getGroupExpenses,
  settleExpense
} = require('../controllers/expenseController');

// All routes here are prefixed with /api/expenses
router.route('/')
  .get(getExpenses)
  .post(createExpense);

router.route('/group/:groupId')
  .get(getGroupExpenses);

router.route('/:id/settle')
  .put(settleExpense);

module.exports = router;
