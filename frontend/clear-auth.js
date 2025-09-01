// Emergency clear script for browser console
// Run this in the browser console if you're experiencing login/logout loops

console.log('Clearing all authentication data...');

// Clear localStorage
localStorage.clear();

// Clear sessionStorage
sessionStorage.clear();

// Clear any potential cookies (for same domain)
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});

console.log('All data cleared. Please refresh the page.');

// Optionally refresh the page
// window.location.reload();
