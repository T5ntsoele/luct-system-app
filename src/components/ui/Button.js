// src/components/ui/Button.js
import React from 'react';

const Button = ({ children, variant = 'primary', type = 'button', onClick, className = '', disabled = false }) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;