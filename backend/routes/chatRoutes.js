const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Message = require('../models/Message');

const router = express.Router();

// Get messages for a specific group/channel
router.get('/:groupId/:channel', protect, async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.groupId, channel: req.params.channel })
                                  .populate('sender', 'name avatar')
                                  .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a new message
router.post('/', protect, async (req, res) => {
  try {
    const { content, groupId, channel, fileUrl } = req.body;
    
    if (!content && !fileUrl) {
      return res.status(400).json({ message: 'Message content or file required' });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      content: content || '',
      group: groupId,
      channel: channel || 'general',
      fileUrl
    });

    const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'name avatar');
    
    // the socket.io part is handled in the frontend by emitting to 'send_message', 
    // but we can also emit from server if we want: req.app.get('io').to(groupId).emit('receive_message', populatedMessage);
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
