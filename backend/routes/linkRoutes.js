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

// Define routes
router.post('/', authenticate, updateLinkProfile);
router.get('/', authenticate, getLinkProfile);
router.get('/public/:username', getPublicLinkProfile);
router.post('/track-click', trackLinkClick);

// Add the upload-image route
router.post('/upload-image', authenticate, upload.single('image'), uploadProfileImage);

export default router;