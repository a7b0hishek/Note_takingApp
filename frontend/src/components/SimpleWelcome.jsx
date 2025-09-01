import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SimpleWelcome = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Note Taking App! 👋
        </h1>
        {user && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">User Profile</h2>
            <p><strong>Name:</strong> {user.name || 'N/A'}</p>
            <p><strong>Email:</strong> {user.email || 'N/A'}</p>
            <p><strong>ID:</strong> {user.id || 'N/A'}</p>
          </div>
        )}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Full Dashboard
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
              className="block w-full text-left px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleWelcome;
