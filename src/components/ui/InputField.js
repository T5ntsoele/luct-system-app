// src/components/ui/InputField.js
import React from 'react';

const InputField = ({ label, name, value, onChange, type = 'text', required = false, placeholder = '', disabled = false }) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        id={name}
        type={type}
        className="form-control"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default InputField;