// Date formatting utilities
export const dateFormatter = {
  // Format date to readable string
  formatDate: (date, options = {}) => {
    try {
      const dateObj = new Date(date);
      const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options,
      };
      return dateObj.toLocaleDateString('en-US', defaultOptions);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  },

  // Format date and time
  formatDateTime: (date, options = {}) => {
    try {
      const dateObj = new Date(date);
      const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...options,
      };
      return dateObj.toLocaleDateString('en-US', defaultOptions);
    } catch (error) {
      console.error('Error formatting date time:', error);
      return 'Invalid Date';
    }
  },

  // Get relative time (e.g., "2 hours ago")
  getRelativeTime: (date) => {
    try {
      const now = new Date();
      const dateObj = new Date(date);
      const diffInMs = now - dateObj;
      const diffInSeconds = Math.floor(diffInMs / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInSeconds < 60) {
        return 'Just now';
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else {
        return dateFormatter.formatDate(date);
      }
    } catch (error) {
      console.error('Error getting relative time:', error);
      return 'Unknown';
    }
  },

  // Format date for input fields
  formatForInput: (date) => {
    try {
      const dateObj = new Date(date);
      return dateObj.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date for input:', error);
      return '';
    }
  },

  // Check if date is today
  isToday: (date) => {
    try {
      const today = new Date();
      const dateObj = new Date(date);
      return (
        today.getDate() === dateObj.getDate() &&
        today.getMonth() === dateObj.getMonth() &&
        today.getFullYear() === dateObj.getFullYear()
      );
    } catch (error) {
      console.error('Error checking if date is today:', error);
      return false;
    }
  },

  // Check if date is yesterday
  isYesterday: (date) => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateObj = new Date(date);
      return (
        yesterday.getDate() === dateObj.getDate() &&
        yesterday.getMonth() === dateObj.getMonth() &&
        yesterday.getFullYear() === dateObj.getFullYear()
      );
    } catch (error) {
      console.error('Error checking if date is yesterday:', error);
      return false;
    }
  },
};
