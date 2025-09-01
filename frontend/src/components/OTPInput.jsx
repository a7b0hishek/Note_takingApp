import React, { useState, useRef, useEffect } from 'react';

const OTPInput = ({ value, onChange, length = 6, disabled = false }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (value) {
      const otpArray = value.split('').slice(0, length);
      while (otpArray.length < length) {
        otpArray.push('');
      }
      setOtp(otpArray);
    }
  }, [value, length]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Call parent onChange
    const otpString = newOtp.join('');
    onChange(otpString);

    // Focus next input
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty, focus previous input
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        onChange(newOtp.join(''));
      }
    }
    // Handle paste
    else if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const pastedOtp = text.replace(/\D/g, '').slice(0, length);
        const newOtp = pastedOtp.split('');
        while (newOtp.length < length) {
          newOtp.push('');
        }
        setOtp(newOtp);
        onChange(newOtp.join(''));
        
        // Focus last filled input or last input
        const lastFilledIndex = Math.min(pastedOtp.length - 1, length - 1);
        inputRefs.current[lastFilledIndex]?.focus();
      });
    }
    // Handle arrow keys
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const newOtp = pastedData.split('');
    while (newOtp.length < length) {
      newOtp.push('');
    }
    setOtp(newOtp);
    onChange(newOtp.join(''));
    
    // Focus last input
    const lastIndex = Math.min(pastedData.length - 1, length - 1);
    inputRefs.current[lastIndex]?.focus();
  };

  return (
    <div className="flex justify-center space-x-2">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          ref={(el) => (inputRefs.current[index] = el)}
          disabled={disabled}
          className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
            disabled 
              ? 'bg-gray-100 border-gray-300 text-gray-500' 
              : 'border-gray-300 text-gray-900 hover:border-gray-400'
          } ${data ? 'border-indigo-400 bg-indigo-50' : ''}`}
        />
      ))}
    </div>
  );
};

export default OTPInput;
