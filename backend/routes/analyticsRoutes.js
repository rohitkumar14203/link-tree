import express from 'express';
import { getAnalytics, trackLinkClick } from '../controllers/analyticsController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route - requires authentication
router.get('/', authenticate, getAnalytics);

// Public route - no authentication required for tracking clicks
router.post('/track-link', trackLinkClick);

export default router;