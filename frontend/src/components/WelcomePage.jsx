import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { fetchUserProfile, clearAuth } from '../redux/authSlice';
import { fetchNotes, createNote, deleteNote, clearError } from '../redux/notesSlice';
import { tokenHandler } from '../utils/tokenHandler';
import FormField from './FormField';
import LoadingButton from './LoadingButton';
import DevOTPHelper from './DevOTPHelper';

const WelcomePage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, loading: authLoading, isAuthenticated } = useSelector((state) => state.auth);
  const { notes, loading: notesLoading, error } = useSelector((state) => state.notes);

  // Initialize data when component mounts
  useEffect(() => {
    const initializeData = async () => {
      // Skip if already initialized or not authenticated
      if (isInitialized || !isAuthenticated || authLoading) {
        return;
      }

      try {
        console.log('Initializing WelcomePage data...');
        
        // Fetch user profile if we don't have user data
        if (!user) {
          console.log('Fetching user profile...');
          await dispatch(fetchUserProfile()).unwrap();
        }
        
        // Fetch notes
        console.log('Fetching notes...');
        await dispatch(fetchNotes()).unwrap();
        
        setIsInitialized(true);
        console.log('WelcomePage data initialized successfully');
      } catch (error) {
        console.error('Failed to initialize WelcomePage data:', error);
        
        // Check if it's an authentication error
        const errorMessage = typeof error === 'string' ? error : error.message || 'Unknown error';
        const isAuthError = errorMessage.includes('401') || 
                           errorMessage.includes('unauthorized') || 
                           errorMessage.includes('Token') ||
                           errorMessage.includes('token');

        if (isAuthError) {
          console.log('Authentication error detected, redirecting to login');
          tokenHandler.removeToken();
          toast.error('Session expired. Please login again.');
          navigate('/login');
        } else {
          toast.error('Failed to load data. Please refresh the page.');
        }
      }
    };

    initializeData();
  }, [dispatch, isAuthenticated, authLoading, user, isInitialized, navigate]);

  // Handle API errors
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
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    } else if (formData.content.length > 5000) {
      newErrors.content = 'Content must be less than 5000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(createNote({
        title: formData.title.trim(),
        content: formData.content.trim()
      })).unwrap();
      
      toast.success('Note created successfully!');
      setFormData({ title: '', content: '' });
      setShowCreateForm(false);
      setErrors({});
    } catch (error) {
      console.error('Failed to create note:', error);
      toast.error(error || 'Failed to create note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await dispatch(deleteNote(noteId)).unwrap();
      toast.success('Note deleted successfully!');
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete note:', error);
      toast.error(error || 'Failed to delete note');
    }
  };

  const confirmDelete = (noteId, noteTitle) => {
    setDeleteConfirm({ id: noteId, title: noteTitle });
  };

  const handleLogout = () => {
    try {
      // Clear auth state synchronously
      dispatch(clearAuth());
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, clear local auth and navigate
      tokenHandler.removeToken();
      navigate('/login');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show loading if auth is still loading or data is not initialized
  if (authLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, this will be handled by ProtectedRoute, but add extra check
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-gray-600">Please login to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug Helper - Remove in production */}
      {process.env.NODE_ENV === 'development' && <DevOTPHelper />}
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
            </div>
            
            {/* User Profile Section */}
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-600">
            You have {notes?.length || 0} notes. Keep your thoughts organized!
          </p>
        </div>

        {/* Create Note Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
          >
            {showCreateForm ? 'Cancel' : '+ Create New Note'}
          </button>
        </div>

        {/* Create Note Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Note</h3>
            <form onSubmit={handleCreateNote} className="space-y-4">
              <FormField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={errors.title}
                placeholder="Enter note title..."
                required
              />
              
              <FormField
                label="Content"
                name="content"
                type="textarea"
                value={formData.content}
                onChange={handleInputChange}
                error={errors.content}
                placeholder="Write your note content here..."
                rows={6}
                required
              />
              
              <div className="flex space-x-4">
                <LoadingButton
                  type="submit"
                  loading={notesLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Create Note
                </LoadingButton>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({ title: '', content: '' });
                    setErrors({});
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Notes</h3>
          
          {/* Loading State */}
          {notesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading notes...</p>
            </div>
          ) : notes?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
              <p className="text-gray-600 mb-4">Create your first note to get started!</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Create Note
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold text-gray-900 truncate">
                      {note.title}
                    </h4>
                    <button
                      onClick={() => confirmDelete(note._id, note.title)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete note"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-4">
                    {note.content}
                  </p>
                  <div className="text-xs text-gray-400">
                    Created: {formatDate(note.createdAt)}
                    {note.updatedAt !== note.createdAt && (
                      <div>Updated: {formatDate(note.updatedAt)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Note</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{deleteConfirm.title}"? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <LoadingButton
                onClick={() => handleDeleteNote(deleteConfirm.id)}
                loading={notesLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Delete
              </LoadingButton>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
