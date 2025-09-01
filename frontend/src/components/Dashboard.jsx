import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  fetchNotes, 
  createNote, 
  updateNote, 
  deleteNote, 
  clearError,
  clearCurrentNote 
} from '../redux/notesSlice';
import { clearAuth } from '../redux/authSlice';
import FormField from './FormField';
import LoadingButton from './LoadingButton';
import ErrorMessage from './ErrorMessage';

const Dashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { notes, loading, error, totalNotes } = useSelector((state) => state.notes);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    dispatch(fetchNotes());
  }, [isAuthenticated, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', tags: [] });
    setErrors({});
    setShowCreateForm(false);
    setEditingNote(null);
    dispatch(clearCurrentNote());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (editingNote) {
        await dispatch(updateNote({ 
          noteId: editingNote._id, 
          noteData: formData 
        })).unwrap();
        toast.success('Note updated successfully!');
      } else {
        await dispatch(createNote(formData)).unwrap();
        toast.success('Note created successfully!');
      }
      resetForm();
    } catch (error) {
      // Error handling is done in the useEffect above
      console.error('Note operation error:', error);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags || []
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await dispatch(deleteNote(noteId)).unwrap();
        toast.success('Note deleted successfully!');
      } catch (error) {
        // Error handling is done in the useEffect above
        console.error('Delete note error:', error);
      }
    }
  };

  const handleLogout = () => {
    try {
      // Clear auth state synchronously
      dispatch(clearAuth());
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login'); // Navigate anyway
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-600 mt-2">Please log in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user?.name}! You have {totalNotes} notes.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <LoadingButton
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                Create Note
              </LoadingButton>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingNote ? 'Edit Note' : 'Create New Note'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter note title"
                error={errors.title}
                required
                disabled={loading}
              />

              <FormField
                label="Content"
                type="textarea"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your note content here..."
                error={errors.content}
                required
                disabled={loading}
                rows={6}
              />

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <LoadingButton
                  type="submit"
                  loading={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingNote ? 'Update Note' : 'Create Note'}
                </LoadingButton>
              </div>
            </form>
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-4">
          {loading && notes.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
              <p className="text-gray-600">Create your first note to get started!</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {note.title}
                  </h3>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(note)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3 line-clamp-3">
                  {note.content}
                </p>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    Created: {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    Updated: {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
