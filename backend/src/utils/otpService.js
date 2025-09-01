const crypto = require('crypto');

class OTPService {
  // Generate 6-digit OTP
  generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Validate OTP format
  isValidOTP(otp) {
    return /^\d{6}$/.test(otp);
  }

  // Generate secure random string for verification tokens
  generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Hash OTP for storage (optional security enhancement)
  hashOTP(otp) {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  // Verify hashed OTP
  verifyHashedOTP(otp, hashedOTP) {
    const hashedInput = this.hashOTP(otp);
    return hashedInput === hashedOTP;
  }
}

module.exports = new OTPService();
