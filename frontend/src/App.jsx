import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { checkAuthStatus } from './redux/authSlice'
import { tokenHandler } from './utils/tokenHandler'
import Login from './components/Login'
import Register from './components/Register'
import WelcomePage from './components/WelcomePage'
import Dashboard from './components/Dashboard'
import TestLogin from './components/TestLogin'
import ProtectedRoute from './components/ProtectedRoute'
import ClearAuth from './components/ClearAuth'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)
  const [initialCheckDone, setInitialCheckDone] = useState(false)

  useEffect(() => {
    // Check if user is authenticated on app load
    const token = tokenHandler.getToken()
    if (token) {
      dispatch(checkAuthStatus())
        .finally(() => setInitialCheckDone(true))
    } else {
      setInitialCheckDone(true)
    }
  }, [dispatch])

  // Show loading only during initial authentication check
  if (!initialCheckDone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="min-h-screen bg-gray-50">
          <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#4aed88',
              },
            },
            error: {
              duration: 5000,
              theme: {
                primary: '#ff4b4b',
              },
            },
          }}
        />
        
        <Routes>
          <Route 
            path="/test" 
            element={<TestLogin />} 
          />
          <Route 
            path="/clear-auth" 
            element={<ClearAuth />} 
          />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/welcome" replace /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/welcome" replace /> : <Register />} 
          />
          <Route 
            path="/welcome" 
            element={
              <ProtectedRoute>
                <WelcomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              isAuthenticated ? <Navigate to="/welcome" replace /> : <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
    </ErrorBoundary>
  )
}

export default App
