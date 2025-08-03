// frontend/src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  fullScreen = false,
  className = '',
  text = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    white: 'text-white'
  };

  const spinnerClasses = `
    ${sizeClasses[size]} 
    ${colorClasses[color]} 
    animate-spin 
    ${className}
  `;

  const Spinner = () => (
    <div className="flex flex-col items-center space-y-2">
      <svg 
        className={spinnerClasses}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <p className={`text-sm ${colorClasses[color]} opacity-75`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
        <Spinner />
      </div>
    );
  }

  return <Spinner />;
};

// Button spinner for inline use
export const ButtonSpinner = ({ className = '' }) => (
  <svg 
    className={`animate-spin w-4 h-4 ${className}`}
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4"
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// Loading card for skeleton layouts
export const LoadingCard = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 animate-pulse ${className}`}>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
      <div className="flex space-x-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

// Loading skeleton for various content types
export const LoadingSkeleton = ({ 
  variant = 'text',
  lines = 3,
  className = ''
}) => {
  const variants = {
    text: 'h-4 bg-gray-200 rounded',
    title: 'h-6 bg-gray-200 rounded',
    button: 'h-10 bg-gray-200 rounded w-24',
    image: 'h-48 bg-gray-200 rounded',
    circle: 'w-12 h-12 bg-gray-200 rounded-full'
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`animate-pulse space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div 
            key={index}
            className={`${variants.text} ${
              index === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`animate-pulse ${className}`}>
      <div className={variants[variant]} />
    </div>
  );
};

// Table loading skeleton
export const LoadingTable = ({ rows = 5, columns = 4 }) => (
  <div className="animate-pulse">
    <div className="bg-gray-50 rounded-t-lg p-4">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="h-4 bg-gray-200 rounded w-3/4" />
        ))}
      </div>
    </div>
    <div className="bg-white rounded-b-lg">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4 border-b border-gray-100 last:border-b-0">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Property card loading skeleton
export const LoadingPropertyCard = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Page loading component
export const PageLoading = ({ message = 'Loading...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="xl" />
      <p className="mt-4 text-lg text-gray-600">{message}</p>
    </div>
  </div>
);

export default LoadingSpinner;