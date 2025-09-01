import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notesAPI } from '../api/notesApi';

// Async thunks
export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notesAPI.getAllNotes();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notes');
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

const initialState = {
  notes: [],
  currentNote: null,
  loading: false,
  error: null,
  totalNotes: 0,
};

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentNote: (state) => {
      state.currentNote = null;
    },
    setCurrentNote: (state, action) => {
      state.currentNote = action.payload;
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
        state.notes = action.payload.notes || action.payload;
        state.totalNotes = action.payload.total || action.payload.length;
        state.error = null;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Note By ID
      .addCase(fetchNoteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNoteById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNote = action.payload;
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
        state.notes.unshift(action.payload);
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
        const index = state.notes.findIndex(note => note._id === action.payload._id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
        state.currentNote = action.payload;
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
        state.notes = state.notes.filter(note => note._id !== action.payload);
        state.totalNotes -= 1;
        state.error = null;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentNote, setCurrentNote } = noteSlice.actions;
export default noteSlice.reducer;
