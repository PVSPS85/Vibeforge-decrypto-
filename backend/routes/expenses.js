const express = require('express');
const router = express.Router();
const {
  addExpense,
  getGroupExpenses,
  settleExpense
} = require('../controllers/expenseController');

// All routes here are prefixed with /api/expenses
router.route('/')
  .post(addExpense);

router.route('/group/:groupId')
  .get(getGroupExpenses);

router.route('/:id/settle')
  .put(settleExpense);

module.exports = router;
