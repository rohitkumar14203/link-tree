import express from 'express';
import authenticate from '../middleware/authMiddleware.js';
import { getAppearance, saveAppearance } from '../controllers/appearanceController.js';

const router = express.Router();

// All routes are protected - require authentication
router.get('/', authenticate, getAppearance);
router.post('/', authenticate, saveAppearance);

export default router;