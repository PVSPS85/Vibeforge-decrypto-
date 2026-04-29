const Group = require('../models/Group');

// @desc    Create a new group
// @route   POST /api/groups
exports.createGroup = async (req, res) => {
  try {
    const { name, description, adminId } = req.body;

    const group = await Group.create({
      name,
      description,
      admin: adminId,
      members: [adminId], // Admin is automatically a member
    });

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
    const { userId } = req.body;

    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    if (group.members.includes(userId)) {
      return res.status(400).json({ success: false, error: 'User already in group' });
    }

    group.members.push(userId);
    await group.save();

    res.status(200).json({ success: true, data: group });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all groups
// @route   GET /api/groups
exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate('members', 'name walletAddress');
    res.status(200).json({ success: true, data: groups });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get single group by ID
// @route   GET /api/groups/:id
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('members', 'name walletAddress');
    if (!group) return res.status(404).json({ success: false, error: 'Group not found' });
    
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
