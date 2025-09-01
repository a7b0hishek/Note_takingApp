const express = require('express');
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  getNotesByTag
} = require('../controllers/notesController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Main CRUD routes
router.route('/')
  .get(getNotes)
  .post(createNote);

// Search route (must be before /:id to avoid conflicts)
router.get('/search', searchNotes);

// Tag-based route
router.get('/tag/:tag', getNotesByTag);

// Individual note routes
router.route('/:id')
  .get(getNote)
  .put(updateNote)
  .delete(deleteNote);

module.exports = router;
