'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './InlineInput.module.scss';

const InlineInput = ({ 
  placeholder = 'Enter name...', 
  onSubmit, 
  onCancel,
  initialValue = ''
}) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit(value);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const handleBlur = () => {
    // If the input loses focus without submitting, cancel
    onCancel();
  };

  return (
    <div className={styles['inline-input']}>
      <img 
        src="/document.svg" 
        alt="Document" 
        className={styles['inline-input__icon']} 
      />
      <input
        ref={inputRef}
        type="text"
        className={styles['inline-input__field']}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default InlineInput;