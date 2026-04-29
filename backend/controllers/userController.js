const User = require('../models/User');

const generateUid = () => {
  return 'SS-' + Math.floor(1000 + Math.random() * 9000);
}

// @desc    Register a new user or get existing
// @route   POST /api/users
exports.registerUser = async (req, res) => {
  try {
    const { name, walletAddress } = req.body;

    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (user) {
      return res.status(200).json({ success: true, data: user, isNewUser: false });
    }

    let isUnique = false;
    let newUid;
    while (!isUnique) {
      newUid = generateUid();
      const existing = await User.findOne({ appUid: newUid });
      if (!existing) isUnique = true;
    }

    user = await User.create({
      displayName: name,
      appUid: newUid,
      walletAddress: walletAddress.toLowerCase(),
      xp: 50, // Starting XP for joining
    });

    res.status(201).json({ success: true, data: user, isNewUser: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update user display name
// @route   PUT /api/users/:walletAddress
exports.updateUser = async (req, res) => {
  try {
    const { displayName } = req.body;
    const user = await User.findOneAndUpdate(
      { walletAddress: req.params.walletAddress.toLowerCase() },
      { displayName },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get user by appUid
// @route   GET /api/users/uid/:appUid
exports.getUserByUid = async (req, res) => {
  try {
    const user = await User.findOne({ appUid: req.params.appUid.toUpperCase() });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.status(200).json({ success: true, data: user });
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
