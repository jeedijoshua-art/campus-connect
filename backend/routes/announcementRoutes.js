const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const Announcement = require('../models/Announcement');

const router = express.Router();

// Get all announcements
router.get('/', protect, async (req, res) => {
  try {
    const announcements = await Announcement.find({}).populate('author', 'name').sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create announcement (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, content, tag } = req.body;
    const announcement = await Announcement.create({
      title,
      content,
      tag: tag || 'General',
      author: req.user._id
    });
    
    // Notify all connect sockets?
    req.app.get('io').emit('new_announcement', announcement);

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
