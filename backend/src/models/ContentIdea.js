const mongoose = require('mongoose');

const ContentIdeaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    contentType: {
      type: String,
      required: [true, 'Please specify content type'],
      enum: ['blog', 'social', 'video', 'podcast', 'email', 'infographic', 'other'],
      default: 'blog'
    },
    platform: {
      type: String,
      required: [true, 'Please specify platform'],
      default: 'all'
    },
    status: {
      type: String,
      enum: ['draft', 'inProgress', 'completed', 'archived'],
      default: 'draft'
    },
    targetAudience: {
      type: [String],
      default: []
    },
    keyPoints: {
      type: [String],
      default: []
    },
    estimatedLength: {
      type: String,
      default: ''
    },
    keywords: {
      type: [String],
      default: []
    },
    notes: {
      type: String,
      default: ''
    },
    isAIGenerated: {
      type: Boolean,
      default: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isFavorite: {
      type: Boolean,
      default: false
    },
    completionDate: {
      type: Date,
      default: null
    },
    performance: {
      views: {
        type: Number,
        default: 0
      },
      engagement: {
        type: Number,
        default: 0
      },
      conversions: {
        type: Number,
        default: 0
      }
    },
    dueDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Create indexes for search performance
ContentIdeaSchema.index({ title: 'text', description: 'text', keywords: 'text' });

module.exports = mongoose.model('ContentIdea', ContentIdeaSchema);