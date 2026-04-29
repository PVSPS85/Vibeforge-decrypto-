const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserByWallet,
  registerUser,
  updateUser,
  getUserByUid
} = require('../controllers/userController');

// All routes here are prefixed with /api/users in server.js
router.route('/')
  .get(getUsers)
  .post(registerUser);

router.route('/uid/:appUid')
  .get(getUserByUid);

router.route('/:walletAddress')
  .get(getUserByWallet)
  .put(updateUser);

module.exports = router;
