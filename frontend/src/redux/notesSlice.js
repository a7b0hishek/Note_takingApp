import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notesAPI } from '../api/notesApi';

// Async thunks
export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await notesAPI.getAllNotes(params);
      // Handle both response.data.data and response.data formats
      return response.data.data || response.data;
    } catch (error) {
      console.error('Fetch notes error:', error);
      const message = error.response?.data?.message || error.message || 'Failed to fetch notes';
      return rejectWithValue(message);
    }
  }
);

export const fetchNoteById = createAsyncThunk(
  'notes/fetchNoteById',
  async (noteId, { rejectWithValue }) => {
    try {
      const response = await notesAPI.getNoteById(noteId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch note');
    }
  }
);

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (noteData, { rejectWithValue }) => {
    try {
      const response = await notesAPI.createNote(noteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create note');
    }
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ noteId, noteData }, { rejectWithValue }) => {
    try {
      const response = await notesAPI.updateNote(noteId, noteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update note');
    }
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (noteId, { rejectWithValue }) => {
    try {
      await notesAPI.deleteNote(noteId);
      return noteId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete note');
    }
  }
);

export const searchNotes = createAsyncThunk(
  'notes/searchNotes',
  async ({ query, params = {} }, { rejectWithValue }) => {
    try {
      const response = await notesAPI.searchNotes(query, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search notes');
    }
  }
);

const initialState = {
  notes: [],
  currentNote: null,
  searchResults: [],
  loading: false,
  error: null,
  searchLoading: false,
  searchError: null,
  totalNotes: 0,
  filters: {
    category: 'all',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  },
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchError: (state) => {
      state.searchError = null;
    },
    clearCurrentNote: (state) => {
      state.currentNote = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchError = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updateNoteLocally: (state, action) => {
      const { noteId, updates } = action.payload;
      const noteIndex = state.notes.findIndex(note => note._id === noteId);
      if (noteIndex !== -1) {
        state.notes[noteIndex] = { ...state.notes[noteIndex], ...updates };
      }
      if (state.currentNote && state.currentNote._id === noteId) {
        state.currentNote = { ...state.currentNote, ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notes
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload.data || [];
        state.totalNotes = action.payload.count || 0;
        state.error = null;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Note by ID
      .addCase(fetchNoteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNoteById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNote = action.payload.data;
        state.error = null;
      })
      .addCase(fetchNoteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Note
      .addCase(createNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.unshift(action.payload.data);
        state.totalNotes += 1;
        state.error = null;
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Note
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        const updatedNote = action.payload.data;
        const noteIndex = state.notes.findIndex(note => note._id === updatedNote._id);
        if (noteIndex !== -1) {
          state.notes[noteIndex] = updatedNote;
        }
        if (state.currentNote && state.currentNote._id === updatedNote._id) {
          state.currentNote = updatedNote;
        }
        state.error = null;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Note
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        const deletedNoteId = action.payload;
        state.notes = state.notes.filter(note => note._id !== deletedNoteId);
        state.totalNotes -= 1;
        if (state.currentNote && state.currentNote._id === deletedNoteId) {
          state.currentNote = null;
        }
        state.error = null;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search Notes
      .addCase(searchNotes.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchNotes.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.data || [];
        state.searchError = null;
      })
      .addCase(searchNotes.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
      });
  },
});

export const {
  clearError,
  clearSearchError,
  clearCurrentNote,
  clearSearchResults,
  setFilters,
  updateNoteLocally,
} = notesSlice.actions;

export default notesSlice.reducer;
