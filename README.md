# 📝 Note Taking App - Full Stack Application

A modern, secure, and feature-rich note-taking application built with React, Node.js, Express, and MongoDB. This application provides user authentication, CRUD operations for notes, real-time updates, and a responsive design.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (running locally on port 27017)
- **npm** package manager

### 🏃‍♂️ Running the Application

1. **Clone and Setup**:
   ```bash
   git clone <repository-url>
   cd Note_taking_App
   ```

2. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Backend will run on: http://localhost:5001

3. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will run on: http://localhost:3000

4. **Access the Application**:
   - **Frontend UI**: http://localhost:3000
   - **Backend API**: http://localhost:5001
   - **Test Login**: 
     - Email: `sumarduni@gmail.com`
     - Password: `password123`

## ✨ Features

### 🔐 **Authentication & Security**
- JWT-based authentication
- Secure password hashing with bcryptjs
- Protected routes and middleware
- Session management
- Login/logout functionality

### 📝 **Note Management**
- Create, read, update, delete notes
- Rich text content support
- Real-time updates
- Note validation and error handling

### 🎨 **User Interface**
- Modern, responsive design with Tailwind CSS
- Mobile-friendly interface
- Toast notifications for user feedback
- Loading states and error handling
- Dark/light theme support

### 🔧 **Developer Experience**
- Hot reload with Vite (frontend) and Nodemon (backend)
- Comprehensive error handling
- API documentation
- Environment configuration
- Development and production builds

## 🏗️ **Tech Stack**

### **Frontend**
- **Framework**: React 18.2.0
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Security**: bcryptjs
- **Environment**: dotenv
- **CORS**: Enabled for frontend integration
- **Development**: Nodemon

### **Database**
- **Database**: MongoDB
- **Connection**: Local MongoDB instance
- **Models**: User, Note, OTP
- **Validation**: Mongoose schema validation

## 📁 **Project Structure**

```
Note_taking_App/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── api/                # API integration layer
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── redux/              # State management
│   │   ├── utils/              # Utility functions
│   │   ├── styles/             # CSS and styling
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # App entry point
│   ├── public/                 # Static assets
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
├── backend/                    # Node.js backend API
│   ├── src/
│   │   ├── config/             # Database and app configuration
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Express middleware
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic services
│   │   └── utils/              # Utility functions
│   ├── server.js               # Server entry point
│   ├── package.json            # Backend dependencies
│   └── .env                    # Environment variables
├── docs/                       # Documentation
├── API_SUMMARY.md              # API documentation
├── EMAIL_SETUP.md              # Email configuration guide
└── README.md                   # This file
```

## 🔌 **API Endpoints**

### **Authentication Routes** (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/login` | User login | Public |
| POST | `/register` | User registration | Public |
| GET | `/me` | Get current user profile | Private |
| PUT | `/profile` | Update user profile | Private |
| PUT | `/password` | Change password | Private |

### **Notes Routes** (`/api/notes`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all user notes | Private |
| POST | `/` | Create new note | Private |
| GET | `/:id` | Get specific note | Private |
| PUT | `/:id` | Update note | Private |
| DELETE | `/:id` | Delete note | Private |

## ⚙️ **Configuration**

### **Environment Variables**

**Backend** (`.env`):
```env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/note-taking-app
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:3000
SESSION_SECRET=your-session-secret
```

**Frontend** (`.env`):
```env
VITE_API_BASE_URL=http://localhost:5001/api
```

## 🔧 **Development**

### **Backend Development**
```bash
cd backend
npm run dev          # Start with nodemon (auto-restart)
npm start            # Start production server
npm test             # Run tests (when implemented)
```

### **Frontend Development**
```bash
cd frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🚀 **Deployment**

### **Backend Deployment**
1. Set environment variables for production
2. Use PM2 or similar process manager
3. Set up MongoDB Atlas for cloud database
4. Configure CORS for production domain
5. Set up SSL/HTTPS

### **Frontend Deployment**
1. Build the application: `npm run build`
2. Deploy `dist/` folder to hosting service
3. Configure environment variables
4. Set up domain and SSL

## 🧪 **Testing**

### **Test User Account**
- **Email**: `sumarduni@gmail.com`
- **Password**: `password123`
- **Status**: Pre-created and verified

### **API Testing**
Use tools like Postman or curl to test API endpoints:

```bash
# Test login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "sumarduni@gmail.com", "password": "password123"}'

# Test protected route (replace TOKEN with actual JWT)
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## 🔒 **Security Features**

- **Password Security**: bcryptjs hashing
- **Authentication**: JWT tokens with expiration
- **Authorization**: Protected routes and middleware
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Server-side validation
- **Error Handling**: Sanitized error messages
- **Environment Protection**: Sensitive data in environment variables

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Backend not starting**:
   - Check if MongoDB is running
   - Verify environment variables
   - Check port 5001 availability

2. **Frontend not loading**:
   - Check if backend is running
   - Verify API base URL configuration
   - Check console for errors

3. **Authentication issues**:
   - Clear browser storage/cookies
   - Check JWT token expiration
   - Verify user credentials

4. **Database connection**:
   - Ensure MongoDB is running on localhost:27017
   - Check MongoDB service status
   - Verify database URI

## 📋 **Changelog**

### **v1.0.0** (September 1, 2025)
- ✅ Complete authentication system
- ✅ Note CRUD operations
- ✅ Responsive UI with Tailwind CSS
- ✅ JWT-based security
- ✅ Protected routes
- ✅ Error handling and validation
- ✅ Fixed logout functionality
- ✅ Test user setup

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 **License**

This project is licensed under the MIT License.

## 👨‍💻 **Author**

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

**Happy Note Taking! 📝**
├── .gitignore             # Root gitignore
└── README.md              # Main project documentation
```

## Quick Start

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Development (Coming Soon)

```bash
cd backend
npm install
npm run dev
```

## Features

- 🔐 **Authentication**: Secure user registration and login
- 📝 **Note Management**: Create, read, update, and delete notes
- 🏷️ **Tags & Categories**: Organize notes with tags and categories
- 🔍 **Search & Filter**: Powerful search and filtering capabilities
- 📱 **Responsive Design**: Works seamlessly on all devices
- 🎨 **Modern UI**: Clean, intuitive interface with TailwindCSS
- ⚡ **Fast Performance**: Built with Vite for lightning-fast development

## Tech Stack

- **Frontend**: React 18 with functional components and hooks
- **State Management**: Redux Toolkit for predictable state management
- **Routing**: React Router v6 for navigation
- **Styling**: TailwindCSS for utility-first styling
- **Build Tool**: Vite for fast development and building
- **HTTP Client**: Axios for API communication

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation component
│   ├── NoteCard.jsx    # Individual note display
│   ├── NoteForm.jsx    # Form for creating/editing notes
│   ├── Loader.jsx      # Loading spinner component
│   └── ProtectedRoute.jsx # Route protection wrapper
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Notes.jsx       # Notes listing page
│   ├── AddNote.jsx     # Add new note page
│   ├── EditNote.jsx    # Edit existing note page
│   ├── Signin.jsx      # Sign in page
│   └── Signup.jsx      # Sign up page
├── redux/              # State management
│   ├── store.js        # Redux store configuration
│   ├── authSlice.js    # Authentication state slice
│   └── noteSlice.js    # Notes state slice
├── api/                # API communication
│   ├── index.js        # Axios configuration
│   ├── authApi.js      # Authentication API calls
│   └── notesApi.js     # Notes API calls
├── utils/              # Utility functions
│   ├── tokenHandler.js # JWT token management
│   ├── dateFormatter.js # Date formatting utilities
│   └── helpers.js      # General helper functions
├── styles/             # Global styles
│   └── index.css       # Global CSS with Tailwind imports
├── App.jsx             # Main app component with routing
└── main.jsx            # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd note-taking-app
```

2. Install dependencies
```bash
npm install
```

3. Create environment variables
Create a `.env` file in the root directory:
```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server
```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Authentication
- User registration with validation
- Secure login with JWT tokens
- Protected routes for authenticated users
- Automatic token refresh and logout

### Note Management
- Create notes with title, content, tags, and categories
- Edit existing notes with real-time updates
- Delete notes with confirmation
- Responsive note cards with previews

### Organization
- Tag-based organization system
- Category selection for better grouping
- Search functionality across all note fields
- Sort by date, title, or other criteria

### User Experience
- Responsive design for all screen sizes
- Loading states and error handling
- Smooth animations and transitions
- Intuitive navigation and UI

## API Integration

The app is designed to work with a REST API backend. The expected API endpoints include:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Token verification

### Notes
- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create new note
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## State Management

The application uses Redux Toolkit for state management with two main slices:

- **authSlice**: Manages user authentication state
- **noteSlice**: Manages notes data and operations

## Styling

TailwindCSS is used for styling with:
- Utility-first approach for rapid development
- Responsive design classes
- Custom components and utilities
- Dark mode support (ready for implementation)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on the repository.
