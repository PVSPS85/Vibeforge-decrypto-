const User = require('../models/User');

// @desc    Register a new user or get existing
// @route   POST /api/users
exports.registerUser = async (req, res) => {
  try {
    const { username, walletAddress, email } = req.body;

    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (user) {
      return res.status(200).json({ success: true, data: user });
    }

    user = await User.create({
      username,
      walletAddress: walletAddress.toLowerCase(),
      email,
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get user by wallet address
// @route   GET /api/users/:walletAddress
exports.getUserByWallet = async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
