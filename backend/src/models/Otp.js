const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true,
    length: 6
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function() {
      return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    }
  },
  verified: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3 // Maximum 3 verification attempts
  }
}, {
  timestamps: true
});

// Create index for automatic document deletion when expired
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Create compound index for efficient queries
otpSchema.index({ email: 1, verified: 1 });

// Instance method to check if OTP is expired
otpSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Instance method to check if OTP attempts exceeded
otpSchema.methods.attemptsExceeded = function() {
  return this.attempts >= 3;
};

// Static method to find valid OTP
otpSchema.statics.findValidOTP = async function(email, otp) {
  return await this.findOne({
    email: email.toLowerCase(),
    otp: otp,
    verified: false,
    expiresAt: { $gt: new Date() }
  });
};

// Static method to cleanup expired/old OTPs for an email
otpSchema.statics.cleanupOldOTPs = async function(email) {
  try {
    const result = await this.deleteMany({
      email: email.toLowerCase(),
      $or: [
        { expiresAt: { $lt: new Date() } },
        { verified: true }
      ]
    });
    console.log(`🧹 Cleaned up ${result.deletedCount} old OTPs for ${email}`);
    return result;
  } catch (error) {
    console.error('Error cleaning up old OTPs:', error);
  }
};

// Pre-save middleware to ensure email is lowercase
otpSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// Pre-save middleware to validate OTP format
otpSchema.pre('save', function(next) {
  if (this.otp && !/^\d{6}$/.test(this.otp)) {
    return next(new Error('OTP must be a 6-digit number'));
  }
  next();
});

module.exports = mongoose.model('Otp', otpSchema);
