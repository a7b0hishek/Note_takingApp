import React from 'react';

const LoadingButton = ({ 
  children, 
  loading = false, 
  disabled = false, 
  className = '', 
  type = 'button',
  onClick,
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative flex items-center justify-center
        ${disabled || loading 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:opacity-90'
        }
        ${className}
      `}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
};

export default LoadingButton;
