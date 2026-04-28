const express = require('express');
const router = express.Router();
const {
  createGroup,
  getGroups,
  getGroupById,
  addMemberToGroup
} = require('../controllers/groupController');

// All routes here are prefixed with /api/groups
router.route('/')
  .get(getGroups)
  .post(createGroup);

router.route('/:id')
  .get(getGroupById);

router.route('/:id/members')
  .post(addMemberToGroup);

module.exports = router;
