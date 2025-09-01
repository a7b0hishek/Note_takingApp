const crypto = require('crypto');

/**
 * Generate a secure random 6-digit OTP
 * @returns {string} 6-digit OTP
 */
function generateOTP() {
  // Generate a random number between 100000 and 999999
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

/**
 * Generate a cryptographically secure 6-digit OTP
 * @returns {string} 6-digit OTP
 */
function generateSecureOTP() {
  // Generate 3 random bytes (24 bits)
  const randomBytes = crypto.randomBytes(3);
  
  // Convert to number and ensure it's 6 digits
  const randomNumber = parseInt(randomBytes.toString('hex'), 16);
  const otp = (randomNumber % 900000) + 100000;
  
  return otp.toString();
}

/**
 * Validate OTP format
 * @param {string} otp - OTP to validate
 * @returns {boolean} True if valid format
 */
function validateOTPFormat(otp) {
  return typeof otp === 'string' && /^\d{6}$/.test(otp);
}

/**
 * Generate OTP with enhanced security options
 * @param {Object} options - Generation options
 * @param {number} options.length - OTP length (default: 6)
 * @param {boolean} options.alphanumeric - Include letters (default: false)
 * @param {boolean} options.secure - Use crypto.randomBytes (default: true)
 * @returns {string} Generated OTP
 */
function generateCustomOTP(options = {}) {
  const {
    length = 6,
    alphanumeric = false,
    secure = true
  } = options;

  if (alphanumeric) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      if (secure) {
        const randomIndex = crypto.randomInt(0, chars.length);
        result += chars[randomIndex];
      } else {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    
    return result;
  }

  // Numeric only
  if (secure) {
    return generateSecureOTP();
  } else {
    return generateOTP();
  }
}

module.exports = {
  generateOTP,
  generateSecureOTP,
  generateCustomOTP,
  validateOTPFormat
};
