import api from './index';

export const notesAPI = {
  // Get all notes
  getAllNotes: (params = {}) => {
    return api.get('/notes', { params });
  },

  // Get note by ID
  getNoteById: (noteId) => {
    return api.get(`/notes/${noteId}`);
  },

  // Create new note
  createNote: (noteData) => {
    return api.post('/notes', noteData);
  },

  // Update note
  updateNote: (noteId, noteData) => {
    return api.put(`/notes/${noteId}`, noteData);
  },

  // Delete note
  deleteNote: (noteId) => {
    return api.delete(`/notes/${noteId}`);
  },

  // Search notes
  searchNotes: (query, params = {}) => {
    return api.get('/notes/search', { 
      params: { q: query, ...params } 
    });
  },

  // Get notes by category/tag
  getNotesByCategory: (category, params = {}) => {
    return api.get('/notes/category', { 
      params: { category, ...params } 
    });
  },

  // Bulk delete notes
  bulkDeleteNotes: (noteIds) => {
    return api.delete('/notes/bulk', { 
      data: { noteIds } 
    });
  },

  // Archive/Unarchive note
  toggleArchiveNote: (noteId) => {
    return api.patch(`/notes/${noteId}/archive`);
  },

  // Pin/Unpin note
  togglePinNote: (noteId) => {
    return api.patch(`/notes/${noteId}/pin`);
  },
};
