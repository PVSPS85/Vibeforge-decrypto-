const Group = require('../models/Group');

// @desc    Create a new group
// @route   POST /api/groups
exports.createGroup = async (req, res) => {
  try {
    const { name, emoji, tag, tagColor, adminWallet } = req.body;

    const group = await Group.create({
      name,
      emoji,
      tag,
      tagColor,
      admin: adminWallet.toLowerCase(),
      members: [adminWallet.toLowerCase()], // Admin is automatically a member
    });

    const User = require('../models/User');
    await User.findOneAndUpdate({ walletAddress: adminWallet.toLowerCase() }, { $inc: { xp: 100 } });

    res.status(201).json({ success: true, data: group });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Add a member to a group
// @route   POST /api/groups/:id/members
exports.addMemberToGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    const { appUid } = req.body;

    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    // Find the user by appUid
    const User = require('../models/User');
    const userToAdd = await User.findOne({ appUid: appUid.toUpperCase() });
    
    if (!userToAdd) {
      return res.status(404).json({ success: false, error: 'User with this UID not found' });
    }

    const walletAddress = userToAdd.walletAddress;

    if (group.members.includes(walletAddress)) {
      return res.status(400).json({ success: false, error: 'User already in group' });
    }

    group.members.push(walletAddress);
    await group.save();

    // Reward XP for joining a group
    await User.findOneAndUpdate({ walletAddress: walletAddress.toLowerCase() }, { $inc: { xp: 50 } });

    res.status(200).json({ success: true, data: group });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all groups for a user
// @route   GET /api/groups?wallet=0x...
exports.getGroups = async (req, res) => {
  try {
    const wallet = req.query.wallet;
    let query = {};
    if (wallet) {
      query = { members: wallet.toLowerCase() };
    }
    const groups = await Group.find(query).lean();
    
    const User = require('../models/User');
    for (let group of groups) {
      const memberUsers = await User.find({ walletAddress: { $in: group.members } }).lean();
      group.populatedMembers = memberUsers;
    }
    
    res.status(200).json({ success: true, data: groups });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get single group by ID
// @route   GET /api/groups/:id
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).lean();
    if (!group) return res.status(404).json({ success: false, error: 'Group not found' });
    
    // Fetch user objects for all members so frontend can display names and UIDs
    const User = require('../models/User');
    const memberUsers = await User.find({ walletAddress: { $in: group.members } }).lean();
    
    // Attach the fetched user objects to the response
    group.populatedMembers = memberUsers;
    
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
