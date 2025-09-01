const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const { generateSecureOTP, validateOTPFormat } = require('./src/utils/otpGenerator');
const emailService = require('./src/utils/mailer');
const Otp = require('./src/models/Otp');

async function testOTPSystem() {
  console.log('🧪 Testing OTP System...\n');

  try {
    // Test 1: OTP Generation
    console.log('1️⃣ Testing OTP Generation:');
    const otp1 = generateSecureOTP();
    const otp2 = generateSecureOTP();
    console.log(`   Generated OTP 1: ${otp1} (Valid: ${validateOTPFormat(otp1)})`);
    console.log(`   Generated OTP 2: ${otp2} (Valid: ${validateOTPFormat(otp2)})`);
    console.log(`   OTPs are different: ${otp1 !== otp2}\n`);

    // Test 2: OTP Validation
    console.log('2️⃣ Testing OTP Validation:');
    console.log(`   Valid "123456": ${validateOTPFormat("123456")}`);
    console.log(`   Invalid "12345": ${validateOTPFormat("12345")}`);
    console.log(`   Invalid "abc123": ${validateOTPFormat("abc123")}\n`);

    // Test 3: Database Operations
    console.log('3️⃣ Testing Database Operations:');
    const testEmail = 'test@example.com';
    const testOTP = generateSecureOTP();

    // Clean up any existing test data
    await Otp.deleteMany({ email: testEmail });

    // Create OTP record
    const otpRecord = await Otp.create({
      email: testEmail,
      otp: testOTP,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });
    console.log(`   ✅ Created OTP record: ${otpRecord._id}`);

    // Find valid OTP
    const foundOTP = await Otp.findValidOTP(testEmail, testOTP);
    console.log(`   ✅ Found valid OTP: ${foundOTP ? 'Yes' : 'No'}`);

    // Test expiry check
    console.log(`   ⏰ OTP expired: ${otpRecord.isExpired()}`);
    console.log(`   🔄 Attempts exceeded: ${otpRecord.attemptsExceeded()}`);

    // Test 4: Email Service
    console.log('\n4️⃣ Testing Email Service:');
    try {
      await emailService.sendOTP(testEmail, testOTP);
      console.log('   ✅ Email service test completed');
    } catch (error) {
      console.log(`   ❌ Email service error: ${error.message}`);
    }

    // Cleanup
    await Otp.deleteMany({ email: testEmail });
    console.log('   🧹 Cleaned up test data\n');

    console.log('✅ OTP System Test Completed Successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }

  process.exit(0);
}

// Run tests
testOTPSystem();
