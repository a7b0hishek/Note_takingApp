# 🎨 Frontend - Note Taking App

A modern, responsive React frontend for the Note Taking App built with Vite, Redux Toolkit, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm package manager

### Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5001/api
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   
   The app will be available at: http://localhost:3000

## 🛠️ **Tech Stack**

- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.4.19
- **State Management**: Redux Toolkit 2.0.1
- **Routing**: React Router DOM 6.20.1
- **Styling**: Tailwind CSS 3.4.16
- **HTTP Client**: Axios 1.6.2
- **Notifications**: React Hot Toast 2.6.0
- **Icons**: Integrated SVG icon system

## 📁 **Project Structure**

```
frontend/
├── src/
│   ├── api/                    # API integration layer
│   │   ├── index.js           # Axios configuration
│   │   ├── authApi.js         # Authentication API calls
│   │   └── notesApi.js        # Notes API calls
│   ├── components/            # Reusable React components
│   │   ├── Dashboard.jsx      # Main dashboard component
│   │   ├── WelcomePage.jsx    # Welcome/home page
│   │   ├── Login.jsx          # Login component
│   │   ├── Register.jsx       # Registration component
│   │   ├── Navbar.jsx         # Navigation component
│   │   ├── ProtectedRoute.jsx # Route protection
│   │   ├── NoteCard.jsx       # Individual note display
│   │   ├── NoteForm.jsx       # Note creation/editing
│   │   ├── FormField.jsx      # Reusable form input
│   │   ├── LoadingButton.jsx  # Loading state button
│   │   ├── Loader.jsx         # Loading spinner
│   │   ├── ErrorMessage.jsx   # Error display
│   │   └── ClearAuth.jsx      # Authentication clearing
│   ├── pages/                 # Page components
│   │   ├── Home.jsx           # Home page
│   │   ├── Notes.jsx          # Notes listing page
│   │   ├── AddNote.jsx        # Add note page
│   │   ├── EditNote.jsx       # Edit note page
│   │   ├── Signin.jsx         # Sign in page
│   │   └── Signup.jsx         # Sign up page
│   ├── redux/                 # State management
│   │   ├── store.js           # Redux store configuration
│   │   ├── authSlice.js       # Authentication state
│   │   ├── notesSlice.js      # Notes state management
│   │   └── noteSlice.js       # Individual note state
│   ├── utils/                 # Utility functions
│   │   ├── tokenHandler.js    # JWT token management
│   │   ├── dateFormatter.js   # Date formatting utilities
│   │   └── helpers.js         # General helper functions
│   ├── styles/                # Styling files
│   │   └── index.css          # Global styles
│   ├── assets/                # Static assets
│   │   └── fluid-background.svg
│   ├── App.jsx                # Main app component
│   └── main.jsx               # App entry point
├── public/                    # Static public assets
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
└── .env                       # Environment variables
```

## 🔧 **Available Scripts**

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint for code quality

# Dependencies
npm install          # Install all dependencies
npm update           # Update dependencies
```

## 🎨 **Features**

### **Authentication**
- User registration with email verification
- Secure login/logout functionality
- JWT token management
- Protected routes
- Persistent login sessions

### **Note Management**
- Create new notes with title and content
- Edit existing notes
- Delete notes with confirmation
- Real-time updates
- Form validation

### **User Interface**
- Responsive design for all screen sizes
- Modern, clean interface with Tailwind CSS
- Toast notifications for user feedback
- Loading states and error handling
- Smooth transitions and animations

### **State Management**
- Redux Toolkit for predictable state updates
- Async thunks for API calls
- Centralized error handling
- Optimistic updates

## 🔐 **Authentication Flow**

1. **Registration**: Users register with email and password
2. **Login**: JWT tokens are stored securely
3. **Protected Routes**: Routes require authentication
4. **Token Management**: Automatic token refresh and validation
5. **Logout**: Clean token removal and redirect

## 📱 **Responsive Design**

The application is fully responsive and works seamlessly across:
- **Desktop**: Full-featured interface
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface with mobile navigation

## 🔌 **API Integration**

### **Base Configuration**
- **Base URL**: `http://localhost:5001/api`
- **Authentication**: Bearer token in headers
- **Error Handling**: Interceptors for request/response

### **API Endpoints Used**
```javascript
// Authentication
POST /auth/login      // User login
POST /auth/register   // User registration
GET  /auth/me         // Get current user
PUT  /auth/profile    // Update profile

// Notes
GET    /notes         // Get all notes
POST   /notes         // Create note
GET    /notes/:id     // Get single note
PUT    /notes/:id     // Update note
DELETE /notes/:id     // Delete note
```

## 🎯 **Redux State Structure**

### **Auth Slice**
```javascript
{
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
}
```

### **Notes Slice**
```javascript
{
  notes: [],
  currentNote: null,
  loading: false,
  error: null,
  totalNotes: 0
}
```

## 🔧 **Configuration**

### **Environment Variables**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5001/api

# App Configuration
VITE_APP_NAME="Note Taking App"
VITE_APP_VERSION="1.0.0"
```

### **Vite Configuration**
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
})
```

### **Tailwind Configuration**
Custom theme configuration for consistent design:
- Color palette
- Typography scales
- Spacing system
- Responsive breakpoints

## 🔍 **Development Guidelines**

### **Component Structure**
```jsx
// Component template
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const ComponentName = () => {
  // Hooks
  const [localState, setLocalState] = useState(null);
  const dispatch = useDispatch();
  
  // Redux state
  const { data, loading, error } = useSelector(state => state.slice);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // Event handlers
  const handleEvent = () => {
    // Handle events
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### **State Management Patterns**
- Use Redux for global state
- Local state for component-specific data
- Async thunks for API calls
- Error boundaries for error handling

### **Styling Guidelines**
- Use Tailwind CSS utility classes
- Component-scoped styles when needed
- Consistent spacing and typography
- Mobile-first responsive design

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Development server not starting**:
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

2. **API connection issues**:
   - Check if backend is running on port 5001
   - Verify `VITE_API_BASE_URL` in `.env`
   - Check browser console for CORS errors

3. **Authentication issues**:
   - Clear localStorage: `localStorage.clear()`
   - Check JWT token expiration
   - Verify API endpoints

4. **Build issues**:
   ```bash
   # Clear Vite cache
   rm -rf node_modules/.vite
   npm run build
   ```

## 🚀 **Production Build**

### **Building for Production**
```bash
npm run build
```

### **Production Considerations**
- Minified and optimized bundle
- Environment-specific API URLs
- Error tracking integration
- Performance monitoring

### **Deployment**
The built application (`dist/` folder) can be deployed to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting service

## 📦 **Dependencies**

### **Core Dependencies**
- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Client-side routing
- `@reduxjs/toolkit` - State management
- `react-redux` - React Redux bindings
- `axios` - HTTP client
- `react-hot-toast` - Notifications

### **Development Dependencies**
- `vite` - Build tool
- `@vitejs/plugin-react` - Vite React plugin
- `tailwindcss` - CSS framework
- `eslint` - Code linting
- `autoprefixer` - CSS vendor prefixes

## 🔄 **Updates & Maintenance**

### **Updating Dependencies**
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update specific package
npm install package@latest
```

### **Version Management**
- Follow semantic versioning
- Document breaking changes
- Test thoroughly before releases

---

**Frontend developed with ❤️ using React and Vite**
