import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-error-600 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`input ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 