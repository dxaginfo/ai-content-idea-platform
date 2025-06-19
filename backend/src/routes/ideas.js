const express = require('express');
const { protect } = require('../middleware/auth');
const ContentIdea = require('../models/ContentIdea');

const router = express.Router();

/**
 * @route   GET /api/ideas
 * @desc    Get all ideas for a user with filtering and pagination
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      contentType,
      platform,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { user: req.user.id };

    // Add filters if provided
    if (status) query.status = status;
    if (contentType) query.contentType = contentType;
    if (platform) query.platform = platform;
    
    // Add text search if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { keywords: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Count total documents for pagination
    const total = await ContentIdea.countDocuments(query);

    // Calculate pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = parseInt(page) * parseInt(limit);
    const totalPages = Math.ceil(total / parseInt(limit));

    // Get ideas with sorting and pagination
    const ideas = await ContentIdea.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(startIndex)
      .limit(parseInt(limit));

    // Return response
    res.status(200).json({
      success: true,
      count: ideas.length,
      pagination: {
        total,
        pages: totalPages,
        page: parseInt(page),
        limit: parseInt(limit),
        hasNextPage: endIndex < total,
        hasPrevPage: startIndex > 0
      },
      ideas
    });
  } catch (error) {
    console.error(`Error fetching ideas: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * @route   GET /api/ideas/:id
 * @desc    Get a single idea by ID
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const idea = await ContentIdea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    // Check if the user owns the idea
    if (idea.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this idea'
      });
    }

    res.status(200).json({
      success: true,
      idea
    });
  } catch (error) {
    console.error(`Error fetching idea: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * @route   POST /api/ideas
 * @desc    Create a new idea
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
  try {
    const newIdea = new ContentIdea({
      ...req.body,
      user: req.user.id
    });

    const idea = await newIdea.save();

    res.status(201).json({
      success: true,
      idea
    });
  } catch (error) {
    console.error(`Error creating idea: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * @route   PUT /api/ideas/:id
 * @desc    Update an idea
 * @access  Private
 */
router.put('/:id', protect, async (req, res) => {
  try {
    let idea = await ContentIdea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    // Check if the user owns the idea
    if (idea.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this idea'
      });
    }

    // Update idea
    idea = await ContentIdea.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      idea
    });
  } catch (error) {
    console.error(`Error updating idea: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * @route   DELETE /api/ideas/:id
 * @desc    Delete an idea
 * @access  Private
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const idea = await ContentIdea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    // Check if the user owns the idea
    if (idea.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this idea'
      });
    }

    await idea.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Idea removed'
    });
  } catch (error) {
    console.error(`Error deleting idea: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;