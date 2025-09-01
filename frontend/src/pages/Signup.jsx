import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { authAPI } from '../api/authApi';
import { setCredentials } from '../redux/authSlice';
import Loader from '../components/Loader';
import OTPInput from '../components/OTPInput';

const Signup = () => {
  const [step, setStep] = useState('method'); // 'method', 'email', 'otp', 'complete'
  const [authMethod, setAuthMethod] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading: authLoading } = useSelector((state) => state.auth);

  // Timer for OTP resend
  React.useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(timer => timer - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOTPChange = (otpValue) => {
    setFormData(prev => ({
      ...prev,
      otp: otpValue
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMethodSelect = (method) => {
    setAuthMethod(method);
    if (method === 'google') {
      handleGoogleSignup();
    } else {
      setStep('email');
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.sendOTP({ email: formData.email });
      
      if (response.data.success) {
        toast.success('📧 OTP sent successfully! Check your email.', {
          duration: 4000,
          icon: '🔐'
        });
        setOtpSent(true);
        setStep('otp');
        setResendTimer(60); // 60 seconds cooldown
        
        // Show development mode message if in console mode
        if (process.env.NODE_ENV === 'development') {
          setTimeout(() => {
            toast('💻 Development Mode: Check the backend terminal for OTP code', {
              duration: 6000,
              icon: '🔍'
            });
          }, 2000);
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      const errorCode = error.response?.data?.errorCode;
      
      if (errorCode === 'EMAIL_SERVICE_UNAVAILABLE') {
        toast.error('📧 Email service is currently unavailable. Please use traditional signup below.', {
          duration: 6000
        });
        setStep('traditional'); // Redirect to traditional signup
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();

    if (!formData.otp || formData.otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    if (!formData.name || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.verifyOTP({
        email: formData.email,
        otp: formData.otp,
        name: formData.name,
        password: formData.password
      });

      if (response.data.success) {
        dispatch(setCredentials(response.data.data));
        toast.success('🎉 Account created successfully! Welcome aboard!', {
          duration: 4000,
          icon: '✅'
        });
        navigate('/notes');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to verify OTP';
      toast.error(message, {
        duration: 4000
      });
      
      // If OTP is invalid, clear the OTP field
      if (message.includes('Invalid') || message.includes('expired')) {
        setFormData(prev => ({ ...prev, otp: '' }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      const response = await authAPI.sendOTP({ email: formData.email });
      
      if (response.data.success) {
        toast.success('New OTP sent successfully!');
        setResendTimer(60);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend OTP';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // Redirect to Google OAuth
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  const handleTraditionalSignup = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        dispatch(setCredentials(response.data.data));
        toast.success('Account created successfully!');
        navigate('/notes');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create account';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join thousands of users organizing their thoughts
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          {/* Method Selection */}
          {step === 'method' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 text-center mb-6">
                Choose your signup method
              </h3>
              
              {/* Google OAuth Button */}
              <button
                onClick={() => handleMethodSelect('google')}
                className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              {/* Email OTP Button */}
              <button
                onClick={() => handleMethodSelect('email')}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                Sign up with Email & OTP
              </button>

              <div className="text-center">
                <button
                  onClick={() => setStep('traditional')}
                  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Or use traditional signup (no OTP)
                </button>
              </div>
            </div>
          )}

          {/* Email Input Step */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <button
                  type="button"
                  onClick={() => setStep('method')}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-800 mb-4"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Enter your email
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  We'll send you a 6-digit verification code
                </p>
                
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email address"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader size="small" /> : 'Send OTP'}
              </button>
            </form>
          )}

          {/* OTP Verification & Account Creation */}
          {step === 'otp' && (
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <div>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-800 mb-4"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Verify your email
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Enter the 6-digit code sent to <strong>{formData.email}</strong>
                </p>
                
                <div className="mb-6">
                  <OTPInput
                    value={formData.otp}
                    onChange={handleOTPChange}
                    length={6}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="text-center mb-4">
                  {resendTimer > 0 ? (
                    <span className="text-sm text-gray-500">
                      Resend OTP in {resendTimer}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-sm text-indigo-600 hover:text-indigo-500 font-medium disabled:opacity-50"
                    >
                      {isLoading ? 'Sending...' : 'Resend OTP'}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Create a password (min 6 characters)"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader size="small" /> : 'Create Account'}
              </button>
            </form>
          )}

          {/* Traditional Signup */}
          {step === 'traditional' && (
            <form onSubmit={handleTraditionalSignup} className="space-y-4">
              <button
                type="button"
                onClick={() => setStep('method')}
                className="flex items-center text-sm text-gray-600 hover:text-gray-800 mb-4"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Create a password (min 6 characters)"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader size="small" /> : 'Create Account'}
              </button>
            </form>
          )}

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/signin"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
