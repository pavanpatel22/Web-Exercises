import React from 'react';
import clsx from 'clsx';
import './Switch.css';

export const Switch = ({ checked, onChange, disabled }) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      className={clsx(
        'switch',
        checked && 'switch-checked',
        disabled && 'switch-disabled'
      )}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <span className="switch-thumb" />
    </button>
  );
};