const validator = require('validator');

// Email validation
const validateEmail = (email) => {
  if (!email) {
    return 'Email is required';
  }
  if (!validator.isEmail(email)) {
    return 'Please provide a valid email address';
  }
  return null;
};

// Password validation
const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

// Name validation
const validateName = (name) => {
  if (!name) {
    return 'Name is required';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (name.length > 50) {
    return 'Name cannot exceed 50 characters';
  }
  return null;
};

// OTP validation
const validateOTP = (otp) => {
  if (!otp) {
    return 'OTP is required';
  }
  if (!/^\d{6}$/.test(otp)) {
    return 'OTP must be exactly 6 digits';
  }
  return null;
};

// Note title validation
const validateNoteTitle = (title) => {
  if (!title) {
    return 'Note title is required';
  }
  if (title.trim().length < 1) {
    return 'Note title cannot be empty';
  }
  if (title.length > 100) {
    return 'Note title cannot exceed 100 characters';
  }
  return null;
};

// Note content validation
const validateNoteContent = (content) => {
  if (!content) {
    return 'Note content is required';
  }
  if (content.trim().length < 1) {
    return 'Note content cannot be empty';
  }
  if (content.length > 10000) {
    return 'Note content cannot exceed 10,000 characters';
  }
  return null;
};

// Middleware function to validate input and return errors
const validateInput = (validations) => {
  return (req, res, next) => {
    const errors = {};
    
    for (const field in validations) {
      const value = req.body[field];
      const validator = validations[field];
      const error = validator(value);
      
      if (error) {
        errors[field] = error;
      }
    }
    
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  };
};

// Pre-defined validation middleware
const validateLogin = validateInput({
  email: validateEmail,
  password: validatePassword
});

const validateRegister = validateInput({
  name: validateName,
  email: validateEmail,
  password: validatePassword
});

const validateOTPRequest = validateInput({
  email: validateEmail
});

const validateOTPVerification = validateInput({
  email: validateEmail,
  otp: validateOTP
});

const validateNote = validateInput({
  title: validateNoteTitle,
  content: validateNoteContent
});

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validateOTP,
  validateNoteTitle,
  validateNoteContent,
  validateInput,
  validateLogin,
  validateRegister,
  validateOTPRequest,
  validateOTPVerification,
  validateNote
};
