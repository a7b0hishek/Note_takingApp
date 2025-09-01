import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { checkAuthStatus } from '../redux/authSlice';
import { tokenHandler } from '../utils/tokenHandler';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, loading, token, user } = useSelector((state) => state.auth);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = tokenHandler.getToken();
      
      // If no token exists, mark as checked and redirect
      if (!storedToken) {
        setHasChecked(true);
        return;
      }

      // If we have a token but not authenticated, verify it
      if (storedToken && !isAuthenticated && !loading && !hasChecked) {
        try {
          await dispatch(checkAuthStatus()).unwrap();
        } catch (error) {
          console.error('Auth check failed:', error);
          // Token is invalid, remove it
          tokenHandler.removeToken();
        } finally {
          setHasChecked(true);
        }
      } else if (isAuthenticated) {
        setHasChecked(true);
      }
    };

    checkAuth();
  }, [dispatch, isAuthenticated, loading, hasChecked]);

  // Show loading spinner while checking authentication
  if (loading || !hasChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // If not authenticated after check, redirect to login
  if (!isAuthenticated || !tokenHandler.getToken()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
