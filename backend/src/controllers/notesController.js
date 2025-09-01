const asyncHandler = require('express-async-handler');
const Note = require('../models/Note');

// @desc    Get all notes for logged in user
// @route   GET /api/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
const getNote = asyncHandler(async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this note'
      });
    }

    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    console.error('Get note error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
const createNote = asyncHandler(async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Title must be at least 3 characters long'
      });
    }

    if (!content || content.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Content must be at least 10 characters long'
      });
    }

    const note = await Note.create({
      title: title.trim(),
      content: content.trim(),
      tags: tags || [],
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    console.error('Create note error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this note'
      });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    console.error('Update note error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this note'
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Delete note error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

// @desc    Search notes
// @route   GET /api/notes/search
// @access  Private
const searchNotes = asyncHandler(async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    const searchQuery = q.trim();
    const notes = await Note.find({
      user: req.user.id,
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } },
        { tags: { $in: [new RegExp(searchQuery, 'i')] } }
      ]
    }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    console.error('Search notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

// @desc    Get notes by tag
// @route   GET /api/notes/tag/:tag
// @access  Private
const getNotesByTag = asyncHandler(async (req, res) => {
  try {
    const { tag } = req.params;

    if (!tag || tag.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid tag'
      });
    }

    const tagQuery = tag.trim();
    const notes = await Note.find({
      user: req.user.id,
      tags: { $in: [new RegExp(tagQuery, 'i')] }
    }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    console.error('Get notes by tag error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  getNotesByTag
};
