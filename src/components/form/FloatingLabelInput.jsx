// src/components/form/FloatingLabelInput.jsx
import React, { useState } from 'react';

const FloatingLabelInput = ({ 
  type = 'text', 
  name, 
  value, 
  onChange, 
  label, 
  required = false,
  readOnly = false,
  className = '',
  placeholder = ' ',
  options = [],
  step,
  min,
  max,
  isCalculated = false,
  position = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== '';
  
  // Bestimme Basis-Klassen
  const baseInputClasses = `
    peer w-full p-3 pt-6 border rounded-md transition-all duration-200
    focus:ring-2 focus:outline-none
    ${readOnly ? 'bg-gray-50' : 'bg-white'}
    ${isCalculated ? 'bg-gray-50 text-gray-700' : ''}
  `;
  
  // Bestimme Randfarbe basierend auf Zustand und Optionen
  const getBorderClasses = () => {
    if (readOnly) return 'border-gray-200';
    if (required) return 'border-amber-300';
    
    // Position-spezifische Farben
    if (position === 'Long' && name === 'entryPrice') return 'border-green-300 focus:ring-green-200 focus:border-green-500';
    if (position === 'Short' && name === 'entryPrice') return 'border-red-300 focus:ring-red-200 focus:border-red-500';
    
    // Standard
    return 'border-gray-300 focus:ring-blue-200 focus:border-blue-500';
  };
  
  // Floating Label Klassen
  const labelClasses = `
    absolute left-2 transition-all duration-200 px-1 pointer-events-none
    ${(isFocused || hasValue) 
      ? 'transform -translate-y-3 scale-75 text-xs top-2 bg-white z-10' 
      : 'top-4 text-gray-500'}
    ${isFocused 
      ? 'text-blue-600' 
      : hasValue 
        ? 'text-gray-700' 
        : 'text-gray-500'}
    ${required ? 'after:content-["*"] after:ml-0.5 after:text-amber-500' : ''}
  `;
  
  // Rendere verschiedene Input-Typen
  const renderInput = () => {
    const inputProps = {
      id: name,
      name,
      value: value || '',
      onChange,
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
      className: `${baseInputClasses} ${getBorderClasses()} ${className}`,
      placeholder,
      readOnly,
      ...props
    };
    
    switch (type) {
      case 'select':
        return (
          <select {...inputProps}>
            {options.map((option) => (
              <option key={option.value || option} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
        );
        
      case 'textarea':
        return <textarea {...inputProps} rows={props.rows || 3} />;
        
      case 'number':
        return <input type="number" step={step} min={min} max={max} {...inputProps} />;
        
      default:
        return <input type={type} {...inputProps} />;
    }
  };
  
  return (
    <div className="relative mb-4">
      <label 
        htmlFor={name} 
        className={labelClasses}
      >
        {label}
      </label>
      {renderInput()}
    </div>
  );
};

export default FloatingLabelInput;