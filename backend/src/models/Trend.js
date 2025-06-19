const mongoose = require('mongoose');

const TrendSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: [true, 'Keyword is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  platforms: {
    type: [String],
    default: []
  },
  searchVolume: {
    type: Number,
    default: 0
  },
  growthRate: {
    type: Number, // Percentage growth
    default: 0
  },
  sentimentScore: {
    type: Number, // -1 to 1 where -1 is negative, 0 is neutral, 1 is positive
    min: -1,
    max: 1,
    default: 0
  },
  dataPoints: [
    {
      date: {
        type: Date,
        required: true
      },
      value: {
        type: Number,
        required: true
      }
    }
  ],
  relatedKeywords: {
    type: [String],
    default: []
  },
  demographicAppeal: {
    ageGroups: {
      type: [String],
      default: []
    },
    genders: {
      type: [String],
      default: []
    },
    regions: {
      type: [String],
      default: []
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    default: 'ai-analysis'
  },
  status: {
    type: String,
    enum: ['rising', 'stable', 'declining'],
    default: 'stable'
  }
}, {
  timestamps: true
});

// Add text index for search
TrendSchema.index({ 
  keyword: 'text', 
  category: 'text',
  relatedKeywords: 'text'
});

module.exports = mongoose.model('Trend', TrendSchema);