const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const File = require('../models/File');

const router = express.Router();

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campus-connect',
    resource_type: 'auto', // Allow all file types
  },
});

const upload = multer({ storage });

// Get all files
router.get('/', protect, async (req, res) => {
  try {
    const files = await File.find({}).populate('uploader', 'name');
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload a file
router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = req.file.path;
    
    const newFile = await File.create({
      name: req.body.name || req.file.originalname,
      originalName: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      url: fileUrl,
      uploader: req.user._id
    });

    res.status(201).json(newFile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
