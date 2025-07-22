'use client';

import { useState, useRef } from 'react';
import styles from './SearchBar.module.scss';

const SearchBar = ({ 
  placeholder = 'Search Users',
  onSearch,
  value,
  onChange,
  className = '',
  id,
  name,
  ariaLabel = 'Search',
  disabled = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div 
      className={`${styles['search-bar']} ${isFocused ? styles['search-bar--focused'] : ''} ${className}`}
      onClick={() => inputRef.current?.focus()}
      role="search"
    >
      <svg 
        className={styles['search-bar__icon']} 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none"
        aria-hidden="true"
      >
        <path 
          d="M11 10.5L13.5 13M12 7C12 9.76142 9.76142 12 7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C9.76142 2 12 4.23858 12 7Z" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <input
        ref={inputRef}
        type="text"
        className={styles['search-bar__input']}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        id={id}
        name={name}
        aria-label={ariaLabel}
        disabled={disabled}
      />
    </div>
  );
};

export default SearchBar;