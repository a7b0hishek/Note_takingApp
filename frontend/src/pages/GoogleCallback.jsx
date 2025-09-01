import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setCredentials } from '../redux/authSlice';
import Loader from '../components/Loader';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');
    const error = searchParams.get('error');

    // Dismiss any loading toasts
    toast.dismiss('google-auth');

    if (error) {
      toast.error('Google authentication failed');
      navigate('/signin');
      return;
    }

    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        dispatch(setCredentials({
          user: userData,
          token: token
        }));
        toast.success('Welcome! Successfully signed in with Google.');
        navigate('/notes');
      } catch (error) {
        console.error('Error parsing user data:', error);
        toast.error('Authentication failed');
        navigate('/signin');
      }
    } else {
      toast.error('Authentication failed');
      navigate('/signin');
    }
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <Loader size="large" />
        <p className="mt-4 text-gray-600">Completing your Google sign-in...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
