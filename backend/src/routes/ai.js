const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import controllers
const {
  generateIdeas,
  generateCalendar,
  analyzeTrends,
} = require('../controllers/ai');

// AI routes
router.post('/generate-ideas', protect, generateIdeas);
router.post('/generate-calendar', protect, generateCalendar);
router.post('/analyze-trends', protect, analyzeTrends);

module.exports = router;