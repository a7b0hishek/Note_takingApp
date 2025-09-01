const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Import passport config
require('./src/config/passport');
const passport = require('passport');

// CORS configuration
const corsOptions = {
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // Add production frontend URLs here after deployment
    process.env.FRONTEND_URL || '',
    'https://your-frontend-app.netlify.app',
    'https://your-frontend-app.vercel.app'
  ].filter(Boolean), // Remove empty strings
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'note-taking-app-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/notes', require('./src/routes/notes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5001
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});
app.use('/api/user', require('./src/routes/auth')); // User profile routes (reuse auth routes)

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Debug OTP route
app.post('/api/debug/otp', async (req, res) => {
  try {
    const emailService = require('./src/utils/mailer');
    const { generateSecureOTP } = require('./src/utils/otpGenerator');
    const Otp = require('./src/models/Otp');
    
    const { email } = req.body;
    const testEmail = email || 'debug@test.com';
    
    // Generate OTP
    const otp = generateSecureOTP();
    
    // Test database save
    const otpRecord = await Otp.create({
      email: testEmail,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });
    
    // Test email service
    await emailService.sendOTP(testEmail, otp);
    
    res.json({
      success: true,
      message: 'OTP system test completed',
      data: {
        email: testEmail,
        otp: otp,
        otpId: otpRecord._id,
        emailMode: process.env.EMAIL_MODE,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'OTP system test failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Serve test page
app.get('/test', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>OTP Test</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin: 10px; cursor: pointer; }
            button:hover { background: #0056b3; }
            .response { margin-top: 20px; padding: 15px; border-radius: 5px; white-space: pre-wrap; font-family: monospace; font-size: 14px; }
            .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
            .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        </style>
    </head>
    <body>
        <h1>🔐 OTP System Test</h1>
        <input type="email" id="email" placeholder="Enter email" value="test@example.com" style="width: 300px; padding: 10px; margin: 10px;">
        <br>
        <button onclick="testHealth()">🔍 Health Check</button>
        <button onclick="testDebugOTP()">🐛 Debug OTP</button>
        <button onclick="testSendOTP()">📧 Send OTP</button>
        <br>
        <input type="text" id="otp" placeholder="Enter OTP" maxlength="6" style="width: 200px; padding: 10px; margin: 10px;">
        <button onclick="testVerifyOTP()">✅ Verify OTP</button>
        
        <div id="response"></div>

        <script>
            function showResponse(data, type = 'success') {
                const div = document.getElementById('response');
                div.innerHTML = JSON.stringify(data, null, 2);
                div.className = 'response ' + type;
            }

            async function testHealth() {
                try {
                    const response = await fetch('/api/health');
                    const data = await response.json();
                    showResponse(data, 'success');
                } catch (error) {
                    showResponse({error: error.message}, 'error');
                }
            }

            async function testDebugOTP() {
                try {
                    const email = document.getElementById('email').value;
                    const response = await fetch('/api/debug/otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });
                    const data = await response.json();
                    if (data.success && data.data && data.data.otp) {
                        document.getElementById('otp').value = data.data.otp;
                    }
                    showResponse(data, response.ok ? 'success' : 'error');
                } catch (error) {
                    showResponse({error: error.message}, 'error');
                }
            }

            async function testSendOTP() {
                try {
                    const email = document.getElementById('email').value;
                    const response = await fetch('/api/auth/send-otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });
                    const data = await response.json();
                    showResponse(data, response.ok ? 'success' : 'error');
                } catch (error) {
                    showResponse({error: error.message}, 'error');
                }
            }

            async function testVerifyOTP() {
                try {
                    const email = document.getElementById('email').value;
                    const otp = document.getElementById('otp').value;
                    const response = await fetch('/api/auth/verify-otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, otp })
                    });
                    const data = await response.json();
                    showResponse(data, response.ok ? 'success' : 'error');
                } catch (error) {
                    showResponse({error: error.message}, 'error');
                }
            }
        </script>
    </body>
    </html>
  `);
});

// Default route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Note Taking App API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      notes: '/api/notes',
      health: '/api/health'
    }
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to uncaught exception');
  process.exit(1);
});

module.exports = app;
