import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { tokenHandler } from '../utils/tokenHandler';
import { clearAuth } from '../redux/authSlice';

const ClearAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear all authentication data
    tokenHandler.removeToken();
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear Redux state
    dispatch(clearAuth());
    
    // Show success message
    toast.success('Authentication cleared. Please login again.');
    
    // Redirect to login
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  }, [navigate, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Clearing Authentication</h2>
        <p className="text-gray-600">Redirecting to login page...</p>
      </div>
    </div>
  );
};

export default ClearAuth;
