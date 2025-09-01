const express = require('express');
const { sendOTP, verifyOTP, resendOTP } = require('../controllers/otpController');

const router = express.Router();

// @route   POST /api/auth/send-otp
// @desc    Send OTP to email
// @access  Public
router.post('/send-otp', sendOTP);

// @route   POST /api/auth/verify-otp  
// @desc    Verify OTP code
// @access  Public
router.post('/verify-otp', verifyOTP);

// @route   POST /api/auth/resend-otp
// @desc    Resend OTP to email
// @access  Public
router.post('/resend-otp', resendOTP);

module.exports = router;
