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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/profiles');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

const router = express.Router();

router.route("/")
  .get(authenticate, getLinkProfile)
  .post(authenticate, updateLinkProfile);

router.post('/upload-image', authenticate, upload.single('image'), uploadProfileImage);

// New routes for public access and tracking clicks
router.get('/public/:username', getPublicLinkProfile);
router.post('/click', trackLinkClick);

export default router;