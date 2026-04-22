const express = require('express');
const ExcelJS = require('exceljs');
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Group = require('../models/Group');
const Message = require('../models/Message');
const File = require('../models/File');
const Announcement = require('../models/Announcement');

const router = express.Router();

// Get analytics
router.get('/analytics', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const onlineUsers = await User.countDocuments({ status: 'online' });
    const totalGroups = await Group.countDocuments();
    const totalMessages = await Message.countDocuments();
    const totalFiles = await File.countDocuments();

    res.json({
      totalUsers,
      onlineUsers,
      totalGroups,
      totalMessages,
      totalFiles
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export to Excel
router.get('/export', protect, admin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    
    // Users Sheet
    const usersSheet = workbook.addWorksheet('Users');
    usersSheet.columns = [
      { header: 'ID', key: 'id', width: 30 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Role', key: 'role', width: 15 }
    ];
    const users = await User.find({});
    users.forEach(u => usersSheet.addRow({ id: u._id.toString(), name: u.name, email: u.email, role: u.role }));

    // Groups Sheet
    const groupsSheet = workbook.addWorksheet('Groups');
    groupsSheet.columns = [
      { header: 'ID', key: 'id', width: 30 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Members Count', key: 'members', width: 15 }
    ];
    const groups = await Group.find({});
    groups.forEach(g => groupsSheet.addRow({ id: g._id.toString(), name: g.name, members: g.members.length }));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'CampusConnectData.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
