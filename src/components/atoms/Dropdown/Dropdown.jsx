'use client';

import { useState, useRef, useEffect, forwardRef } from 'react';
import Image from 'next/image';
import styles from './Dropdown.module.scss';

const Dropdown = forwardRef(({ 
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  name,
  id,
  disabled = false,
  required = false,
  error = false,
  errorMessage,
  className = '',
  dropdownClassName = '',
  labelClassName = '',
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const dropdownRef = useRef(null);
  
  // Generate ID if not provided
  const dropdownId = id || `dropdown-${name || Math.random().toString(36).substring(2, 11)}`;

  // Find the selected option to display its label
  const selectedOption = options.find(opt => opt.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          setIsOpen(false);
        }
        break;
      default:
        break;
    }
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (optionValue) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    
    if (onChange) {
      // Simulate native select onChange event
      const event = {
        target: {
          name: name,
          value: optionValue,
          id: dropdownId
        }
      };
      onChange(event);
    }
  };

  return (
    <div 
      className={`${styles.dropdown} ${className}`} 
      ref={dropdownRef}
    >
      {label && (
        <label 
          htmlFor={dropdownId}
          className={`${styles.dropdown__label} ${labelClassName}`}
        >
          {label}
          {required && <span className={styles.dropdown__required}>*</span>}
        </label>
      )}
      
      <div className={styles.dropdown__wrapper}>
        <button
          ref={ref}
          id={dropdownId}
          type="button"
          className={`${styles.dropdown__field} ${error ? styles['dropdown__field--error'] : ''} ${isOpen ? styles['dropdown__field--open'] : ''} ${dropdownClassName}`}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={label || 'Dropdown'}
          aria-invalid={error}
          aria-describedby={error && errorMessage ? `${dropdownId}-error` : undefined}
          {...props}
        >
          <span className={`${styles.dropdown__value} ${!selectedValue ? styles['dropdown__value--placeholder'] : ''}`}>
            {displayText}
          </span>
          <Image 
            src="/chevron-down.svg"
            alt=""
            width={16}
            height={16}
            className={`${styles.dropdown__icon} ${isOpen ? styles['dropdown__icon--open'] : ''}`}
          />
        </button>

        {isOpen && (
          <ul
            className={styles.dropdown__options}
            role="listbox"
            aria-label={label || 'Dropdown options'}
          >
            {options.map((option) => (
              <li
                key={option.value}
                className={`${styles.dropdown__option} ${option.value === selectedValue ? styles['dropdown__option--selected'] : ''}`}
                onClick={() => handleOptionClick(option.value)}
                role="option"
                aria-selected={option.value === selectedValue}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOptionClick(option.value);
                  }
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && errorMessage && (
        <span 
          id={`${dropdownId}-error`}
          className={styles.dropdown__error}
          role="alert"
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
});

Dropdown.displayName = 'Dropdown';

export default Dropdown;