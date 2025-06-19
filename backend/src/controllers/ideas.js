const ContentIdea = require('../models/ContentIdea');

/**
 * @desc    Get all ideas for the logged-in user
 * @route   GET /api/ideas
 * @access  Private
 */
exports.getIdeas = async (req, res) => {
  try {
    // Build query
    const query = { user: req.user.id };

    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by content type
    if (req.query.contentType) {
      query.contentType = req.query.contentType;
    }

    // Filter by platform
    if (req.query.platform) {
      query.platform = req.query.platform;
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Sort
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    // Execute query
    const ideas = await ContentIdea.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await ContentIdea.countDocuments(query);

    // Calculate pagination values
    const pages = Math.ceil(total / limit);
    const hasNextPage = page < pages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      count: ideas.length,
      pagination: {
        total,
        pages,
        page,
        limit,
        hasNextPage,
        hasPrevPage,
      },
      ideas,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @desc    Get single idea
 * @route   GET /api/ideas/:id
 * @access  Private
 */
exports.getIdea = async (req, res) => {
  try {
    const idea = await ContentIdea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found',
      });
    }

    // Make sure user owns the idea
    if (idea.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this idea',
      });
    }

    res.status(200).json({
      success: true,
      idea,
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Idea not found',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @desc    Create new idea
 * @route   POST /api/ideas
 * @access  Private
 */
exports.createIdea = async (req, res) => {
  try {
    // Add user to request body
    req.body.user = req.user.id;

    // Create idea
    const idea = await ContentIdea.create(req.body);

    res.status(201).json({
      success: true,
      idea,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @desc    Update idea
 * @route   PUT /api/ideas/:id
 * @access  Private
 */
exports.updateIdea = async (req, res) => {
  try {
    let idea = await ContentIdea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found',
      });
    }

    // Make sure user owns the idea
    if (idea.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this idea',
      });
    }

    // Update completion date if status is changed to 'completed'
    if (req.body.status === 'completed' && idea.status !== 'completed') {
      req.body.completionDate = Date.now();
    } else if (req.body.status !== 'completed' && idea.status === 'completed') {
      req.body.completionDate = null;
    }

    // Update idea
    idea = await ContentIdea.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      idea,
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Idea not found',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * @desc    Delete idea
 * @route   DELETE /api/ideas/:id
 * @access  Private
 */
exports.deleteIdea = async (req, res) => {
  try {
    const idea = await ContentIdea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found',
      });
    }

    // Make sure user owns the idea
    if (idea.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this idea',
      });
    }

    await idea.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Idea not found',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};