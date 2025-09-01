const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.isDevelopmentMode = false;
    this.initializeTransporter();
  }

  initializeTransporter() {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailMode = process.env.EMAIL_MODE;

    // Check if we're in console mode for development
    if (emailMode === 'console' || !emailUser || !emailPass || 
        emailUser === 'your-email@gmail.com' || emailPass === 'your-app-password') {
      this.isDevelopmentMode = true;
      console.log('📧 Email service running in CONSOLE MODE for development');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });

      this.isConfigured = true;
      console.log('📧 Email service configured with Gmail SMTP');
    } catch (error) {
      console.error('❌ Email service configuration failed:', error.message);
      this.isDevelopmentMode = true;
      console.log('📧 Falling back to CONSOLE MODE');
    }
  }

  async sendOTP(email, otp) {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@notetakingapp.com',
      to: email,
      subject: `Your OTP Code - ${process.env.APP_NAME || 'Note Taking App'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello,</p>
            <p style="font-size: 16px; margin-bottom: 20px;">
              You requested to verify your email address. Please use the OTP code below:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="background-color: #007bff; color: white; padding: 15px 30px; 
                          font-size: 24px; font-weight: bold; border-radius: 8px; 
                          letter-spacing: 3px; display: inline-block;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
              ⏰ This OTP will expire in 5 minutes for security reasons.
            </p>
            <p style="font-size: 14px; color: #666;">
              If you didn't request this verification, please ignore this email.
            </p>
          </div>
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
            © ${new Date().getFullYear()} ${process.env.APP_NAME || 'Note Taking App'}. All rights reserved.
          </p>
        </div>
      `
    };

    if (this.isDevelopmentMode) {
      // Console mode for development
      console.log('\n🔐 ===== OTP EMAIL (CONSOLE MODE) =====');
      console.log('📧 To:', email);
      console.log('🔑 OTP Code:', otp);
      console.log('⏰ Expires in: 5 minutes');
      console.log('=====================================\n');
      return { messageId: 'console-mode-' + Date.now() };
    }

    if (!this.isConfigured) {
      throw new Error('Email service not properly configured');
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ OTP email sent successfully to:', email);
      return info;
    } catch (error) {
      console.error('❌ Failed to send OTP email:', error.message);
      throw new Error('Failed to send OTP email');
    }
  }

  async sendWelcomeEmail(email, name) {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@notetakingapp.com',
      to: email,
      subject: `Welcome to ${process.env.APP_NAME || 'Note Taking App'}! 🎉`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">
            Welcome to ${process.env.APP_NAME || 'Note Taking App'}! 🎉
          </h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello ${name || 'there'},</p>
            <p style="font-size: 16px; margin-bottom: 20px;">
              🎊 Congratulations! Your email has been successfully verified and your account is now active.
            </p>
            <p style="font-size: 16px; margin-bottom: 20px;">
              You can now start organizing your thoughts and ideas with our powerful note-taking features:
            </p>
            <ul style="font-size: 14px; color: #555; margin-left: 20px;">
              <li>📝 Create and organize notes</li>
              <li>🔍 Search through your content</li>
              <li>🏷️ Tag and categorize your notes</li>
              <li>☁️ Secure cloud synchronization</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:3001'}" 
                 style="background-color: #007bff; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 8px; font-weight: bold;">
                Start Taking Notes
              </a>
            </div>
          </div>
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
            © ${new Date().getFullYear()} ${process.env.APP_NAME || 'Note Taking App'}. All rights reserved.
          </p>
        </div>
      `
    };

    if (this.isDevelopmentMode) {
      console.log('\n📬 ===== WELCOME EMAIL (CONSOLE MODE) =====');
      console.log('📧 To:', email);
      console.log('👋 Welcome message sent');
      console.log('=========================================\n');
      return { messageId: 'console-mode-welcome-' + Date.now() };
    }

    if (!this.isConfigured) {
      console.log('⚠️ Email service not configured, skipping welcome email');
      return { messageId: 'skipped-no-config' };
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent successfully to:', email);
      return info;
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error.message);
      // Don't throw error for welcome email - it's not critical
      return { error: error.message };
    }
  }
}

// Create and export a single instance
const emailService = new EmailService();
module.exports = emailService;
