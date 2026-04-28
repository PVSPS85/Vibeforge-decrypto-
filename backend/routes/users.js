const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserByWallet,
  registerUser
} = require('../controllers/userController');

// All routes here are prefixed with /api/users in server.js
router.route('/')
  .get(getUsers)
  .post(registerUser);

router.route('/:walletAddress')
  .get(getUserByWallet);

module.exports = router;
