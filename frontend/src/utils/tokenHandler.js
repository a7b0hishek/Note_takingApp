// Token storage and management utilities
const TOKEN_KEY = 'noteapp_token';

export const tokenHandler = {
  // Get token from localStorage
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token from localStorage:', error);
      return null;
    }
  },

  // Set token in localStorage
  setToken: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting token in localStorage:', error);
    }
  },

  // Remove token from localStorage
  removeToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token from localStorage:', error);
    }
  },

  // Check if token exists
  hasToken: () => {
    return !!tokenHandler.getToken();
  },

  // Decode JWT token (basic decode without verification)
  decodeToken: (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (token) => {
    try {
      const decoded = tokenHandler.decodeToken(token);
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  },

  // Get user info from token
  getUserFromToken: (token) => {
    try {
      const decoded = tokenHandler.decodeToken(token);
      return decoded?.user || null;
    } catch (error) {
      console.error('Error getting user from token:', error);
      return null;
    }
  },

  // Clear all authentication data
  clearAll: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      // Clear any other potential auth data
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('auth') || key.includes('token') || key.includes('user') || key.includes('persist'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};
