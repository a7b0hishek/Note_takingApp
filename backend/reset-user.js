const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./src/models/User');

const resetUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/note-taking-app');
    console.log('Connected to MongoDB');

    // Remove existing user
    await User.deleteOne({ email: 'a7b0hishek@gmail.com' });
    console.log('Removed existing user');

    // Create new user WITHOUT manual hashing (let the model handle it)
    const newUser = new User({
      name: 'Abhishek',
      email: 'a7b0hishek@gmail.com',
      password: 'Abhishek7488940577', // Plain text, let model hash it
      isVerified: true
    });

    await newUser.save();
    console.log('User created successfully');

    // Test the login
    const user = await User.findOne({ email: 'a7b0hishek@gmail.com' }).select('+password');
    console.log('Stored password hash:', user.password);
    console.log('Password hash length:', user.password.length);
    
    const isValid = await bcrypt.compare('Abhishek7488940577', user.password);
    console.log('Password test:', isValid ? 'PASSED' : 'FAILED');

    // Try with a test password to verify bcrypt is working
    const testHash = await bcrypt.hash('test123', 12);
    const testResult = await bcrypt.compare('test123', testHash);
    console.log('Bcrypt test:', testResult ? 'WORKING' : 'BROKEN');

    await mongoose.disconnect();
    console.log('Process completed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetUser();
