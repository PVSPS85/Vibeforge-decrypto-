const User = require('../models/User');

const generateUid = () => {
  return 'SS-' + Math.floor(1000 + Math.random() * 9000);
}

const ensureUniqueUid = async () => {
  let isUnique = false;
  let newUid;
  while (!isUnique) {
    newUid = generateUid();
    const existing = await User.findOne({ appUid: newUid });
    if (!existing) isUnique = true;
  }
  return newUid;
}

// @desc    Register a new user or get existing
// @route   POST /api/users
exports.registerUser = async (req, res) => {
  try {
    const { name, walletAddress } = req.body;

    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (user) {
      // If user exists but has old schema (missing appUid or displayName), repair it
      let needsSave = false;

      if (!user.appUid) {
        user.appUid = await ensureUniqueUid();
        needsSave = true;
      }
      if (!user.displayName && name) {
        user.displayName = name;
        needsSave = true;
      }
      // Migrate old 'name' field to 'displayName' if displayName is missing
      if (!user.displayName && user.get('name')) {
        user.displayName = user.get('name') !== 'User' ? user.get('name') : name || 'User';
        needsSave = true;
      }

      if (needsSave) {
        await user.save();
      }

      return res.status(200).json({ success: true, data: user, isNewUser: false });
    }

    const newUid = await ensureUniqueUid();

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

    // Auto-repair legacy users missing appUid or displayName
    let needsSave = false;
    if (!user.appUid) {
      user.appUid = await ensureUniqueUid();
      needsSave = true;
    }
    if (!user.displayName) {
      // Migrate from old 'name' field if present
      const oldName = user.get('name');
      if (oldName && oldName !== 'User') {
        user.displayName = oldName;
      } else {
        user.displayName = 'Unnamed';
      }
      needsSave = true;
    }
    if (needsSave) {
      await user.save();
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
