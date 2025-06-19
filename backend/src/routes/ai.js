const express = require('express');
const { protect } = require('../middleware/auth');
const { 
  generateContentIdeas, 
  generateContentCalendar, 
  analyzeContentTrends 
} = require('../utils/openaiService');

const router = express.Router();

/**
 * @route   POST /api/ai/generate-ideas
 * @desc    Generate content ideas using AI
 * @access  Private
 */
router.post('/generate-ideas', protect, async (req, res) => {
  try {
    const ideas = await generateContentIdeas(req.body);
    
    res.status(200).json({
      success: true,
      count: ideas.length,
      ideas
    });
  } catch (error) {
    console.error(`Error generating ideas: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error generating content ideas',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/ai/generate-calendar
 * @desc    Generate content calendar using AI
 * @access  Private
 */
router.post('/generate-calendar', protect, async (req, res) => {
  try {
    const calendar = await generateContentCalendar(req.body);
    
    res.status(200).json({
      success: true,
      count: calendar.length,
      calendar
    });
  } catch (error) {
    console.error(`Error generating calendar: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error generating content calendar',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/ai/analyze-trends
 * @desc    Analyze content trends using AI
 * @access  Private
 */
router.post('/analyze-trends', protect, async (req, res) => {
  try {
    const trends = await analyzeContentTrends(req.body);
    
    res.status(200).json({
      success: true,
      trends
    });
  } catch (error) {
    console.error(`Error analyzing trends: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error analyzing content trends',
      error: error.message
    });
  }
});

module.exports = router;