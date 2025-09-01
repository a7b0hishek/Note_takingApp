import React from 'react';

const ErrorMessage = ({ error, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`text-red-500 text-sm mt-1 ${className}`} role="alert">
      {error}
    </div>
  );
};

export default ErrorMessage;
