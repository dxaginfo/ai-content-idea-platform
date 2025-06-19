const mongoose = require('mongoose');

const ContentIdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  contentType: {
    type: String,
    enum: ['blog', 'video', 'social', 'podcast', 'infographic', 'email', 'other'],
    required: [true, 'Content type is required']
  },
  platform: {
    type: String,
    enum: ['youtube', 'tiktok', 'instagram', 'twitter', 'facebook', 'linkedin', 'blog', 'other'],
    required: [true, 'Platform is required']
  },
  targetAudience: {
    type: [String],
    default: []
  },
  keywords: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  complexity: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  estimatedTime: {
    type: Number, // in minutes
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'planned', 'in-progress', 'published', 'archived'],
    default: 'draft'
  },
  scheduledDate: {
    type: Date,
    default: null
  },
  isAIGenerated: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot be more than 2000 characters']
  },
  references: [
    {
      title: String,
      url: String
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Add text index for search
ContentIdeaSchema.index({ 
  title: 'text', 
  description: 'text',
  keywords: 'text',
  tags: 'text'
});

module.exports = mongoose.model('ContentIdea', ContentIdeaSchema);