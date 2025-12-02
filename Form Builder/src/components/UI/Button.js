import React from 'react';
import clsx from 'clsx';
import './Button.css';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  disabled,
  ...props 
}) => {
  return (
    <button
      className={clsx(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        disabled && 'btn-disabled',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};