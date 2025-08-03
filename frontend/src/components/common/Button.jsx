// frontend/src/components/common/Button.jsx
import React from 'react';
import { ButtonSpinner } from './LoadingSpinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center 
    font-medium rounded-lg border transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = {
    primary: `
      bg-blue-600 border-blue-600 text-white
      hover:bg-blue-700 hover:border-blue-700
      focus:ring-blue-500
      disabled:bg-blue-300 disabled:border-blue-300
    `,
    secondary: `
      bg-gray-600 border-gray-600 text-white
      hover:bg-gray-700 hover:border-gray-700
      focus:ring-gray-500
      disabled:bg-gray-300 disabled:border-gray-300
    `,
    success: `
      bg-green-600 border-green-600 text-white
      hover:bg-green-700 hover:border-green-700
      focus:ring-green-500
      disabled:bg-green-300 disabled:border-green-300
    `,
    warning: `
      bg-yellow-600 border-yellow-600 text-white
      hover:bg-yellow-700 hover:border-yellow-700
      focus:ring-yellow-500
      disabled:bg-yellow-300 disabled:border-yellow-300
    `,
    danger: `
      bg-red-600 border-red-600 text-white
      hover:bg-red-700 hover:border-red-700
      focus:ring-red-500
      disabled:bg-red-300 disabled:border-red-300
    `,
    outline: `
      bg-transparent border-gray-300 text-gray-700
      hover:bg-gray-50 hover:border-gray-400
      focus:ring-gray-500
      disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400
    `,
    ghost: `
      bg-transparent border-transparent text-gray-700
      hover:bg-gray-100
      focus:ring-gray-500
      disabled:bg-transparent disabled:text-gray-400
    `,
    link: `
      bg-transparent border-transparent text-blue-600
      hover:text-blue-700 hover:underline
      focus:ring-blue-500
      disabled:text-blue-300
    `
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const iconClasses = iconSizeClasses[size];

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      {...props}
    >
      {loading && (
        <ButtonSpinner className={`${iconClasses} ${children ? 'mr-2' : ''}`} />
      )}
      
      {!loading && leftIcon && (
        <span className={`${iconClasses} ${children ? 'mr-2' : ''}`}>
          {leftIcon}
        </span>
      )}
      
      {children && !loading && (
        <span>{children}</span>
      )}
      
      {!loading && rightIcon && (
        <span className={`${iconClasses} ${children ? 'ml-2' : ''}`}>
          {rightIcon}
        </span>
      )}
    </button>
  );
};

// Specific button variants for common use cases
export const PrimaryButton = (props) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton = (props) => (
  <Button variant="secondary" {...props} />
);

export const SuccessButton = (props) => (
  <Button variant="success" {...props} />
);

export const DangerButton = (props) => (
  <Button variant="danger" {...props} />
);

export const OutlineButton = (props) => (
  <Button variant="outline" {...props} />
);

export const GhostButton = (props) => (
  <Button variant="ghost" {...props} />
);

export const LinkButton = (props) => (
  <Button variant="link" {...props} />
);

// Icon-only button
export const IconButton = ({ 
  icon, 
  variant = 'ghost', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const iconOnlyClasses = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
    xl: 'p-3'
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`${iconOnlyClasses[size]} ${className}`}
      {...props}
    >
      {icon}
    </Button>
  );
};

// Button group component
export const ButtonGroup = ({ 
  children, 
  className = '',
  orientation = 'horizontal' 
}) => {
  const groupClasses = orientation === 'horizontal' 
    ? 'inline-flex -space-x-px'
    : 'inline-flex flex-col -space-y-px';

  return (
    <div className={`${groupClasses} ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;

        let roundedClasses = '';
        if (orientation === 'horizontal') {
          if (isFirst) roundedClasses = 'rounded-r-none';
          else if (isLast) roundedClasses = 'rounded-l-none';
          else roundedClasses = 'rounded-none';
        } else {
          if (isFirst) roundedClasses = 'rounded-b-none';
          else if (isLast) roundedClasses = 'rounded-t-none';
          else roundedClasses = 'rounded-none';
        }

        return React.cloneElement(child, {
          className: `${child.props.className || ''} ${roundedClasses}`.trim()
        });
      })}
    </div>
  );
};

// Button with dropdown (basic implementation)
export const DropdownButton = ({
  children,
  dropdownItems = [],
  isOpen = false,
  onToggle,
  className = '',
  ...props
}) => {
  return (
    <div className="relative inline-block text-left">
      <Button
        rightIcon={
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        }
        onClick={onToggle}
        className={className}
        {...props}
      >
        {children}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {dropdownItems.map((item, index) => (
              <button
                key={index}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={item.onClick}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Button;