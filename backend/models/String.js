const mongoose = require('mongoose');

const stringSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    trim: true
  },
  app: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'App',
    required: true
  },
  context: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
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
  translations: [{
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
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Compound index for unique keys per app
stringSchema.index({ app: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('String', stringSchema); 