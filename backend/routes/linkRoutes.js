import express from "express";
import {
  updateLinkProfile,
  getLinkProfile,
  uploadProfileImage,
  getPublicLinkProfile,
  trackLinkClick
} from "../controllers/linkController.js";
import authenticate from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/profiles');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

router.route("/")
  .get(authenticate, getLinkProfile)
  .post(authenticate, updateLinkProfile);

// Update the upload image route
router.post('/upload-image', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    console.log('File uploaded:', req.file);

    // Update user's profile image in the database
    const linkProfile = await Link.findOne({ user: req.user._id });
    if (linkProfile) {
      linkProfile.profileImage = req.file.filename;
      await linkProfile.save();
    }

    res.json({
      message: 'File uploaded successfully',
      profileImage: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      message: 'Error uploading file',
      error: error.message
    });
  }
});

// New routes for public access and tracking clicks
router.get('/public/:username', getPublicLinkProfile);
router.post('/click', trackLinkClick);

export default router;