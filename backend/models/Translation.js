const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  string: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'String',
    required: true
  },
  language: {
    type: String,
    required: true
  },
  value: { 
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    text: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Compound index for unique translations per string and language
translationSchema.index({ string: 1, language: 1 }, { unique: true });

module.exports = mongoose.model('Translation', translationSchema); 