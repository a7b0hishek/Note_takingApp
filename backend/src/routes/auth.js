const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { 
  validateLogin, 
  validateRegister 
} = require('../middleware/validation');

const router = express.Router();

// Basic authentication routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/me', protect, getMe);
router.get('/profile', protect, getMe); // Add profile alias for user info
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);

module.exports = router;
