import api from './index';

export const authAPI = {
  // Login user
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  // Register user
  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  // Logout user
  logout: () => {
    return api.post('/auth/logout');
  },

  // Verify token and get user info
  verifyToken: () => {
    return api.get('/auth/me');
  },

  // Get user profile
  getProfile: () => {
    return api.get('/auth/profile');
  },

  // Update user profile
  updateProfile: (userData) => {
    return api.put('/auth/profile', userData);
  },

  // Change password
  changePassword: (passwordData) => {
    return api.put('/auth/change-password', passwordData);
  },

  // Forgot password
  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: (resetData) => {
    return api.post('/auth/reset-password', resetData);
  },

  // Send OTP for signup
  sendOTP: (emailData) => {
    return api.post('/auth/send-otp', emailData);
  },

  // Verify OTP and complete signup
  verifyOTP: (otpData) => {
    return api.post('/auth/verify-otp', otpData);
  },
};
