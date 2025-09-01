const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./src/models/User');

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/note-taking-app');
    console.log('Connected to MongoDB');

    // Remove existing user
    await User.deleteOne({ email: 'sumarduni@gmail.com' });
    console.log('Removed existing user if any');

    // Create new user
    const newUser = new User({
      name: 'Test User',
      email: 'sumarduni@gmail.com',
      password: 'password123',
      isVerified: true
    });

    await newUser.save();
    console.log('User created successfully');

    // Test the login
    const user = await User.findOne({ email: 'sumarduni@gmail.com' }).select('+password');
    console.log('User found:', !!user);
    
    if (user) {
      console.log('Stored password hash:', user.password);
      const isValid = await bcrypt.compare('password123', user.password);
      console.log('Password test:', isValid ? 'PASSED' : 'FAILED');
    }

    await mongoose.disconnect();
    console.log('Process completed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTestUser();
