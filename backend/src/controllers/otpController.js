const asyncHandler = require('express-async-handler');
const Otp = require('../models/Otp');
const emailService = require('../utils/mailer');
const { generateSecureOTP, validateOTPFormat } = require('../utils/otpGenerator');

// @desc    Send OTP via email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Validation
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  // Email format validation
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  try {
    // Cleanup any existing OTPs for this email
    await Otp.cleanupOldOTPs(email);

    // Generate 6-digit OTP
    const otp = generateSecureOTP();

    // Save OTP in database (expires in 5 minutes)
    const otpRecord = await Otp.create({
      email: email.toLowerCase(),
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    });

    // Send OTP via email
    await emailService.sendOTP(email, otp);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        email: email.toLowerCase(),
        expiresIn: '5 minutes',
        otpId: otpRecord._id
      }
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Validation
  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Email and OTP are required'
    });
  }

  // Validate OTP format
  if (!validateOTPFormat(otp)) {
    return res.status(400).json({
      success: false,
      message: 'OTP must be a 6-digit number'
    });
  }

  try {
    // Find valid OTP using the static method
    const otpRecord = await Otp.findValidOTP(email, otp);

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Check if attempts exceeded
    if (otpRecord.attemptsExceeded()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Check if OTP is expired
    if (otpRecord.isExpired()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Clean up - delete the used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        email: email.toLowerCase(),
        verifiedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);

    // Try to increment attempts if OTP record exists
    try {
      const otpRecord = await Otp.findOne({ 
        email: email.toLowerCase(), 
        otp,
        verified: false 
      });
      
      if (otpRecord && !otpRecord.isExpired()) {
        otpRecord.attempts += 1;
        await otpRecord.save();
      }
    } catch (updateError) {
      console.error('Failed to update OTP attempts:', updateError);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  try {
    // Check if there's a recent OTP request (rate limiting)
    const recentOTP = await Otp.findOne({
      email: email.toLowerCase(),
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) } // Within last minute
    });

    if (recentOTP) {
      return res.status(429).json({
        success: false,
        message: 'Please wait before requesting a new OTP',
        retryAfter: 60
      });
    }

    // Cleanup old OTPs and send new one
    await Otp.cleanupOldOTPs(email);
    
    // Generate new OTP
    const otp = generateSecureOTP();
    
    // Save new OTP
    await Otp.create({
      email: email.toLowerCase(),
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    // Send OTP via email
    await emailService.sendOTP(email, otp);

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      data: {
        email: email.toLowerCase(),
        expiresIn: '5 minutes'
      }
    });

  } catch (error) {
    console.error('Resend OTP Error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = {
  sendOTP,
  verifyOTP,
  resendOTP
};
