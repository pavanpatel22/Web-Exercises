import React from 'react';
import clsx from 'clsx';
import './TextInput.css';

export const TextInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  className,
  ...props 
}) => {
  return (
    <div className={clsx('text-input-group', className)}>
      {label && <label className="text-input-label">{label}</label>}
      <input
        type="text"
        className="text-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};