const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Check if we're in development console mode
    this.isDevelopmentMode = process.env.EMAIL_MODE === 'console';
    
    // Check if email credentials are configured
    this.isConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS && 
                          process.env.EMAIL_USER !== 'your-email@gmail.com' && 
                          process.env.EMAIL_PASS !== 'your-app-password');
    
    if (this.isDevelopmentMode) {
      console.log('📧 Email service running in CONSOLE MODE for development');
      this.transporter = null;
    } else if (this.isConfigured) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      console.warn('Email service not configured. Email functionality will be disabled.');
      this.transporter = null;
    }
  }

  async sendOTP(email, otp, name = 'User') {
    if (this.isDevelopmentMode) {
      console.log('📧 DEVELOPMENT MODE - OTP Email:');
      console.log('=================================');
      console.log(`To: ${email}`);
      console.log(`Name: ${name}`);
      console.log(`OTP Code: ${otp}`);
      console.log('Subject: Verify Your Email - OTP Code');
      console.log('=================================');
      return;
    }
    
    if (!this.isConfigured) {
      throw new Error('Email service not configured. Please set EMAIL_USER and EMAIL_PASS in environment variables.');
    }
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'Note Taking App'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - OTP Code',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5; margin: 0;">📝 Note Taking App</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border-left: 4px solid #4F46E5;">
            <h2 style="color: #333; margin-top: 0;">Hello ${name}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Welcome to Note Taking App! To complete your registration, please verify your email address using the OTP code below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: #4F46E5; color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 8px; display: inline-block;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 0;">
              <strong>⚠️ Important:</strong><br>
              • This OTP is valid for <strong>5 minutes</strong> only<br>
              • Don't share this code with anyone<br>
              • If you didn't request this, please ignore this email
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #888; font-size: 12px;">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} Note Taking App. All rights reserved.</p>
          </div>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('OTP email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  }

  async sendWelcomeEmail(email, name) {
    if (this.isDevelopmentMode) {
      console.log('📧 DEVELOPMENT MODE - Welcome Email:');
      console.log('====================================');
      console.log(`To: ${email}`);
      console.log(`Name: ${name}`);
      console.log('Subject: Welcome to Note Taking App! 🎉');
      console.log('====================================');
      return;
    }
    
    if (!this.isConfigured) {
      console.log(`Welcome email would be sent to ${email} (${name}) if email service was configured`);
      return;
    }
    
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'Note Taking App'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Note Taking App! 🎉',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5; margin: 0;">📝 Note Taking App</h1>
          </div>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="margin: 0 0 15px 0;">🎉 Welcome, ${name}!</h2>
            <p style="margin: 0; font-size: 18px;">Your account has been successfully created!</p>
          </div>
          
          <div style="padding: 30px 0;">
            <h3 style="color: #333;">What you can do now:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>📝 Create and organize your notes</li>
              <li>🔍 Search through your notes easily</li>
              <li>🏷️ Use tags to categorize notes</li>
              <li>📱 Access your notes from anywhere</li>
              <li>🔒 Keep your thoughts secure and private</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:3001'}" 
                 style="background: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Start Taking Notes →
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #888; font-size: 12px;">
            <p>Happy note-taking! 📚</p>
            <p>&copy; ${new Date().getFullYear()} Note Taking App. All rights reserved.</p>
          </div>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw error for welcome email failure
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
