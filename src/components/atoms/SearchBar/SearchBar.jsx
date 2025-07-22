'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
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
      <Image 
        src="/search__icon.svg"
        alt=""
        width={16}
        height={16}
        className={styles['search-bar__icon']}
        aria-hidden="true"
      />
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