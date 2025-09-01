# Email Configuration Setup

## For OTP Email Functionality

To enable OTP email verification in your Note Taking App, you need to configure email settings in your `.env` file.

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Navigate to Security > 2-Step Verification
   - Find "App passwords" and click it
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Update .env file:**
```bash
# Replace these values in your backend/.env file
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=your-16-character-app-password
APP_NAME=Note Taking App
```

### Other Email Providers

You can also use other email providers by modifying the `emailService.js` configuration:

```javascript
// For Outlook/Hotmail
service: 'hotmail'

// For Yahoo
service: 'yahoo'

// For custom SMTP
host: 'your-smtp-host'
port: 587
secure: false
```

### Testing Without Email

If you don't want to set up email configuration, the app will:
- Show a friendly error message
- Automatically redirect users to traditional signup
- Log email attempts to console for development

### Development Mode

For testing purposes, you can enable console-only email mode by setting:
```bash
EMAIL_MODE=console
```

This will print emails to the console instead of sending them.
