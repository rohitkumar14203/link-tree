import express from 'express';
import { getAnalytics, trackLinkClick } from '../controllers/analyticsController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

// Debug endpoint - no authentication
router.get('/debug', (req, res) => {
  res.status(200).json({ message: 'Analytics debug endpoint is working' });
});

// Protected route - requires authentication
router.get('/', authenticate, getAnalytics);

// Public route - no authentication required for tracking clicks
router.post('/track-link', trackLinkClick);

export default router;