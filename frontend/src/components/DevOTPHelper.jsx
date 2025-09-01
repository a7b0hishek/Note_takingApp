import React, { useState } from 'react';
import { authAPI } from '../api/authApi';
import toast from 'react-hot-toast';

const DevOTPHelper = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [lastOTP, setLastOTP] = useState('');

  const testSendOTP = async () => {
    try {
      const response = await authAPI.sendOTP({ email: testEmail });
      if (response.data.success) {
        toast.success('✅ OTP sent! Check backend terminal for code');
        setLastOTP('Check backend terminal');
      }
    } catch (error) {
      toast.error('❌ Failed to send OTP: ' + (error.response?.data?.message || error.message));
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
        title="Development OTP Helper"
      >
        🔧
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-64">
          <h3 className="font-semibold text-gray-900 mb-2">🧪 OTP Dev Helper</h3>
          
          <div className="space-y-2">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Test email"
              className="w-full p-2 text-sm border border-gray-300 rounded"
            />
            
            <button
              onClick={testSendOTP}
              className="w-full bg-blue-500 text-white p-2 text-sm rounded hover:bg-blue-600"
            >
              📧 Test Send OTP
            </button>
            
            {lastOTP && (
              <div className="text-xs text-gray-600 mt-2">
                Last OTP: {lastOTP}
              </div>
            )}
            
            <div className="text-xs text-gray-500 mt-2">
              💡 Check backend terminal for OTP codes
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevOTPHelper;
