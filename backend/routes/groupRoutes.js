const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Group = require('../models/Group');

const router = express.Router();

// Get all groups
router.get('/', protect, async (req, res) => {
  try {
    const groups = await Group.find({})
      .populate('admin', 'name avatar role')
      .populate('members', 'name avatar');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a group
router.post('/', protect, async (req, res) => {
  try {
    const { name, subject, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Group name is required' });
    }
    const newGroup = await Group.create({
      name: name.trim(),
      subject: subject?.trim() || '',
      description: description?.trim() || '',
      admin: req.user._id,
      members: [req.user._id],
      channels: [{ name: 'general', type: 'text' }]
    });
    const populated = await Group.findById(newGroup._id)
      .populate('admin', 'name avatar role')
      .populate('members', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join group
router.post('/:id/join', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (!group.members.includes(req.user._id)) {
      group.members.push(req.user._id);
      await group.save();
    }

    const populated = await Group.findById(group._id)
      .populate('admin', 'name avatar role')
      .populate('members', 'name avatar');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete ALL groups — MUST come before /:id to avoid route conflict
router.delete('/all', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized. Admin only.' });
    }
    const result = await Group.deleteMany({});
    res.json({ message: `Cleared ${result.deletedCount} groups successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a single group (group admin OR site Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const isGroupAdmin = group.admin.toString() === req.user._id.toString();
    const isSiteAdmin = req.user.role === 'Admin';

    if (!isGroupAdmin && !isSiteAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this group' });
    }

    await Group.findByIdAndDelete(req.params.id);
    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
