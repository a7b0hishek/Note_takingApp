// General helper utilities
export const helpers = {
  // Truncate text to specified length
  truncateText: (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },

  // Capitalize first letter
  capitalizeFirst: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Generate random ID
  generateId: () => {
    return Math.random().toString(36).substr(2, 9);
  },

  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Deep clone object
  deepClone: (obj) => {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      console.error('Error deep cloning object:', error);
      return obj;
    }
  },

  // Check if object is empty
  isEmpty: (obj) => {
    if (obj === null || obj === undefined) return true;
    if (Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    if (typeof obj === 'string') return obj.trim().length === 0;
    return false;
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Copy text to clipboard
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  },

  // Validate email
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Generate color from string (for avatars, tags, etc.)
  stringToColor: (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 60%)`;
    return color;
  },

  // Sort array of objects by key
  sortByKey: (array, key, direction = 'asc') => {
    return array.sort((a, b) => {
      if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });
  },

  // Filter array by search term
  filterBySearch: (array, searchTerm, searchKeys = []) => {
    if (!searchTerm) return array;
    
    const term = searchTerm.toLowerCase();
    return array.filter(item => {
      if (searchKeys.length === 0) {
        // Search in all string properties
        return Object.values(item).some(value => 
          typeof value === 'string' && value.toLowerCase().includes(term)
        );
      } else {
        // Search in specified keys
        return searchKeys.some(key => 
          typeof item[key] === 'string' && item[key].toLowerCase().includes(term)
        );
      }
    });
  },
};
