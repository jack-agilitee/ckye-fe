'use client';

import { forwardRef } from 'react';
import styles from './TextField.module.scss';

const TextField = forwardRef(({ 
  label,
  placeholder = 'Label',
  value,
  onChange,
  onBlur,
  onFocus,
  name,
  id,
  type = 'text',
  disabled = false,
  required = false,
  error = false,
  errorMessage,
  className = '',
  inputClassName = '',
  labelClassName = '',
  ...props
}, ref) => {
  // Generate ID if not provided
  const inputId = id || `textfield-${name || Math.random().toString(36).substring(2, 11)}`;

  return (
    <div className={`${styles['text-field']} ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className={`${styles['text-field__label']} ${labelClassName}`}
        >
          {label}
          {required && <span className={styles['text-field__required']}>*</span>}
        </label>
      )}
      <div className={styles['text-field__wrapper']}>
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={error}
          aria-describedby={error && errorMessage ? `${inputId}-error` : undefined}
          className={`${styles['text-field__input']} ${error ? styles['text-field__input--error'] : ''} ${inputClassName}`}
          {...props}
        />
      </div>
      {error && errorMessage && (
        <span 
          id={`${inputId}-error`}
          className={styles['text-field__error']}
          role="alert"
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
});

TextField.displayName = 'TextField';

export default TextField;