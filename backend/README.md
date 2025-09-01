# 🔧 Backend - Note Taking App

A robust RESTful API built with Node.js, Express, and MongoDB for the Note Taking App. Features JWT authentication, CRUD operations, comprehensive validation, and security middleware.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (running locally on port 27017)
- **npm** package manager

### Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/note-taking-app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:3000
   SESSION_SECRET=your-super-secret-session-key
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   
   The API will be available at: http://localhost:5001

4. **Create Test User** (Optional):
   ```bash
   node create-test-user.js
   ```

## 🛠️ **Tech Stack**

- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose ODM 8.0.3
- **Authentication**: JSON Web Tokens (JWT) 9.0.2
- **Password Hashing**: bcryptjs 2.4.3
- **Environment Variables**: dotenv 16.3.1
- **CORS**: cors 2.8.5
- **Development**: nodemon 3.1.10
- **Validation**: express-validator 7.0.1

## 📁 **Project Structure**

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js        # MongoDB connection
│   │   └── passport.js        # Passport.js configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── notesController.js # Notes CRUD operations
│   │   └── otpController.js   # OTP functionality
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   ├── errorHandler.js    # Global error handling
│   │   └── validation.js      # Input validation middleware
│   ├── models/
│   │   ├── User.js            # User data model
│   │   ├── Note.js            # Note data model
│   │   └── Otp.js             # OTP data model
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── notes.js           # Notes routes
│   │   └── otp.js             # OTP routes
│   ├── services/
│   │   └── emailService.js    # Email service
│   └── utils/
│       ├── generateToken.js   # JWT token generation
│       ├── jwt.js             # JWT utilities
│       ├── mailer.js          # Email utilities
│       ├── otpGenerator.js    # OTP generation
│       └── otpService.js      # OTP service logic
├── create-test-user.js        # Test user creation script
├── reset-user.js              # User reset script
├── test-api.js                # API testing script
├── server.js                  # Server entry point
├── package.json               # Dependencies and scripts
├── .env                       # Environment variables
├── .env.example               # Environment template
└── README.md                  # This file
```

## 🔧 **Available Scripts**

```bash
# Development
npm run dev          # Start with nodemon (auto-restart)
npm start            # Start production server

# Testing
node test-api.js     # Test API endpoints
node create-test-user.js  # Create test user
node reset-user.js   # Reset test user

# Database
# MongoDB should be running separately
```

## 🔌 **API Endpoints**

### **Authentication Routes** (`/api/auth`)

| Method | Endpoint | Description | Access | Body |
|--------|----------|-------------|--------|------|
| POST | `/login` | User login | Public | `{email, password}` |
| POST | `/register` | User registration | Public | `{name, email, password}` |
| GET | `/me` | Get current user profile | Private | None |
| GET | `/profile` | Get user profile (alias) | Private | None |
| PUT | `/profile` | Update user profile | Private | `{name, email}` |
| PUT | `/password` | Change password | Private | `{currentPassword, newPassword}` |

### **Notes Routes** (`/api/notes`)

| Method | Endpoint | Description | Access | Body |
|--------|----------|-------------|--------|------|
| GET | `/` | Get all user notes | Private | None |
| POST | `/` | Create new note | Private | `{title, content}` |
| GET | `/:id` | Get specific note | Private | None |
| PUT | `/:id` | Update note | Private | `{title, content}` |
| DELETE | `/:id` | Delete note | Private | None |

### **OTP Routes** (`/api/otp`)

| Method | Endpoint | Description | Access | Body |
|--------|----------|-------------|--------|------|
| POST | `/send` | Send OTP to email | Public | `{email}` |
| POST | `/verify` | Verify OTP | Public | `{email, otp}` |

## 🔐 **Authentication & Security**

### **JWT Authentication**
- **Token Generation**: Upon successful login
- **Token Expiration**: 30 days (configurable)
- **Token Storage**: Client-side (localStorage/sessionStorage)
- **Protected Routes**: Middleware-based protection

### **Password Security**
- **Hashing Algorithm**: bcryptjs with salt rounds
- **Password Validation**: Minimum length and complexity
- **Password Update**: Requires current password verification

### **Security Middleware**
```javascript
// JWT Protection
const protect = async (req, res, next) => {
  // Token extraction and validation
  // User verification
  // Request continuation
};

// Error Handling
const errorHandler = (err, req, res, next) => {
  // Error logging
  // Response sanitization
  // Status code determination
};
```

## 📊 **Data Models**

### **User Model**
```javascript
{
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false  // Excluded from queries by default
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### **Note Model**
```javascript
{
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### **OTP Model**
```javascript
{
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
  }
}
```

## ⚙️ **Configuration**

### **Environment Variables**
```env
# Server Configuration
NODE_ENV=development          # Environment mode
PORT=5001                     # Server port

# Database Configuration
MONGO_URI=mongodb://localhost:27017/note-taking-app
MONGODB_URI=mongodb://localhost:27017/note-taking-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
JWT_EXPIRE=30d                # Token expiration

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production-2024

# Email Configuration (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_MODE=console            # console | email
APP_NAME=Note Taking App

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
```

### **Database Connection**
```javascript
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || process.env.MONGO_URI
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};
```

### **CORS Configuration**
```javascript
const corsOptions = {
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};
```

## 🧪 **Testing**

### **Test User Account**
The application includes a pre-configured test user:
```javascript
{
  name: "Test User",
  email: "sumarduni@gmail.com",
  password: "password123",
  isVerified: true
}
```

### **API Testing Scripts**

**Create Test User**:
```bash
node create-test-user.js
```

**Test API Endpoints**:
```bash
node test-api.js
```

**Manual Testing with curl**:
```bash
# Test login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "sumarduni@gmail.com", "password": "password123"}'

# Test protected route (replace TOKEN with actual JWT)
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer TOKEN"

# Create note
curl -X POST http://localhost:5001/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title": "Test Note", "content": "This is a test note."}'
```

## 🔍 **Request/Response Examples**

### **Login Request**
```json
POST /api/auth/login
{
  "email": "sumarduni@gmail.com",
  "password": "password123"
}
```

### **Login Response**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ecb54b24a2001f5e9c8a",
    "name": "Test User",
    "email": "sumarduni@gmail.com"
  }
}
```

### **Create Note Request**
```json
POST /api/notes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
{
  "title": "My First Note",
  "content": "This is the content of my first note."
}
```

### **Create Note Response**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ecb54b24a2001f5e9c8b",
    "title": "My First Note",
    "content": "This is the content of my first note.",
    "user": "60d5ecb54b24a2001f5e9c8a",
    "createdAt": "2023-06-25T10:30:00.000Z",
    "updatedAt": "2023-06-25T10:30:00.000Z"
  }
}
```

## 🚀 **Deployment**

### **Production Considerations**

1. **Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=5001
   MONGO_URI=mongodb://your-production-db
   JWT_SECRET=secure-production-secret
   CLIENT_URL=https://your-frontend-domain.com
   ```

2. **Database**:
   - Use MongoDB Atlas for cloud hosting
   - Enable authentication and SSL
   - Set up database backups

3. **Security**:
   - Use strong JWT secrets
   - Enable HTTPS
   - Configure rate limiting
   - Set up monitoring and logging

4. **Process Management**:
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start with PM2
   pm2 start server.js --name "note-app-backend"
   
   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Server won't start**:
   ```bash
   # Check MongoDB connection
   # Verify environment variables
   # Check port availability
   lsof -i :5001
   ```

2. **Database connection issues**:
   ```bash
   # Start MongoDB service
   brew services start mongodb/brew/mongodb-community
   # Or
   sudo systemctl start mongod
   ```

3. **JWT issues**:
   - Verify JWT_SECRET is set
   - Check token expiration
   - Validate token format

4. **CORS errors**:
   - Verify CLIENT_URL matches frontend URL
   - Check CORS configuration
   - Ensure credentials are included

### **Debugging**

**Enable Debug Logging**:
```javascript
// Add to server.js
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
  });
}
```

**Database Query Debugging**:
```javascript
// Enable Mongoose debugging
mongoose.set('debug', true);
```

## 📦 **Dependencies**

### **Production Dependencies**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT implementation
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `express-validator` - Input validation
- `express-async-handler` - Async error handling
- `nodemailer` - Email functionality
- `passport` - Authentication middleware

### **Development Dependencies**
- `nodemon` - Development server with auto-restart

## 🔄 **Updates & Maintenance**

### **Version Management**
```bash
# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

### **Database Maintenance**
```bash
# Backup database
mongodump --db note-taking-app

# Restore database
mongorestore --db note-taking-app dump/note-taking-app
```

---

**Backend API developed with ❤️ using Node.js and Express**

### Other Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/health` | Health check | Public |
| GET | `/` | API info | Public |

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the backend root:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/note-taking-app
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:3001
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Production Build**
   ```bash
   npm start
   ```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── notesController.js   # Notes CRUD logic
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── errorHandler.js      # Global error handling
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Note.js              # Note schema
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   └── notes.js             # Notes routes
│   └── utils/
│       └── generateToken.js     # JWT token generation
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
├── server.js                    # Main server file
└── README.md                    # This file
```

## Data Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Note Model
```javascript
{
  title: String (required),
  content: String (required),
  tags: [String],
  user: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- General server errors

All errors return a consistent JSON format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## CORS Configuration

CORS is configured to allow requests from the frontend application. Update `CLIENT_URL` in your environment variables to match your frontend URL.

## Development

1. **Database Setup**: Ensure MongoDB is running locally or provide a MongoDB Atlas connection string
2. **Environment Variables**: Copy `.env.example` to `.env` and update values
3. **Testing**: Use tools like Postman or Thunder Client to test API endpoints
4. **Logging**: Server logs include request details and error information

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation
- CORS protection
- Environment variable protection
- Error message sanitization

## Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Set secure JWT secrets
4. Configure proper CORS origins
5. Use process managers like PM2
6. Set up SSL/HTTPS
7. Configure rate limiting (if needed)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/           # Configuration files
│   └── utils/            # Utility functions
├── tests/                 # Test files
├── package.json          # Dependencies
└── README.md             # Backend documentation
```

## Getting Started (When Available)

```bash
cd backend
npm install
npm run dev
```
