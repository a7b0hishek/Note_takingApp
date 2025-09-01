const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    maxlength: [5000, 'Content cannot be more than 5000 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot be more than 30 characters']
  }],
  category: {
    type: String,
    enum: ['personal', 'work', 'ideas', 'study', 'projects', 'meeting', 'journal', 'other'],
    default: 'personal'
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#ffffff',
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color']
  },
  reminder: {
    type: Date,
    default: null
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for better performance
noteSchema.index({ user: 1, createdAt: -1 });
noteSchema.index({ user: 1, title: 'text', content: 'text' });
noteSchema.index({ user: 1, tags: 1 });
noteSchema.index({ user: 1, category: 1 });

// Virtual for note excerpt
noteSchema.virtual('excerpt').get(function() {
  return this.content.length > 150 
    ? this.content.substring(0, 150) + '...' 
    : this.content;
});

// Ensure virtual fields are serialized
noteSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Note', noteSchema);
