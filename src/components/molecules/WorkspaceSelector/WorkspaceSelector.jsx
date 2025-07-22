'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Chip from '@/components/atoms/Chip/Chip';
import styles from './WorkspaceSelector.module.scss';

const WorkspaceSelector = ({ 
  label = 'Workspace',
  placeholder = 'Select workspace members...',
  options = [],
  value = [],
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Filter options based on input and exclude already selected
  const filteredOptions = options.filter(option => {
    const matchesInput = option.name.toLowerCase().includes(inputValue.toLowerCase());
    const notSelected = !value.some(selected => selected.id === option.id);
    return matchesInput && notSelected;
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setInputValue('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setInputValue('');
        setFocusedIndex(-1);
        break;
      case 'Backspace':
        if (inputValue === '' && value.length > 0) {
          // Remove last chip
          const newValue = value.slice(0, -1);
          onChange?.(newValue);
        }
        break;
      default:
        break;
    }
  };

  const handleSelect = (option) => {
    const newValue = [...value, option];
    onChange?.(newValue);
    setInputValue('');
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  const handleRemove = (id) => {
    const newValue = value.filter(item => item.id !== id);
    onChange?.(newValue);
  };

  const handleInputClick = () => {
    setIsOpen(true);
    inputRef.current?.focus();
  };

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      items[focusedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex]);

  return (
    <div 
      className={`${styles['workspace-selector']} ${className}`}
      ref={containerRef}
    >
      <label className={styles['workspace-selector__label']}>
        {label}
      </label>
      
      <div 
        className={`${styles['workspace-selector__field']} ${
          isOpen ? styles['workspace-selector__field--focused'] : ''
        }`}
        onClick={handleInputClick}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="workspace-selector-listbox"
      >
        <div className={styles['workspace-selector__chips']}>
          {value.map((item) => (
            <Chip
              key={item.id}
              text={item.name}
              onDismiss={() => handleRemove(item.id)}
              className={styles['workspace-selector__chip']}
            />
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={value.length === 0 ? placeholder : ''}
            className={styles['workspace-selector__input']}
            aria-label="Search workspace members"
            aria-autocomplete="list"
            aria-describedby="workspace-selector-label"
          />
        </div>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div 
          className={styles['workspace-selector__dropdown']}
          role="listbox"
          id="workspace-selector-listbox"
          ref={listRef}
        >
          {filteredOptions.map((option, index) => (
            <div
              key={option.id}
              role="option"
              aria-selected={index === focusedIndex}
              className={`${styles['workspace-selector__option']} ${
                index === focusedIndex ? styles['workspace-selector__option--focused'] : ''
              }`}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              <span className={styles['workspace-selector__option-name']}>
                {option.name}
              </span>
              <Image 
                src="/check.svg"
                alt=""
                width={16}
                height={16}
                className={styles['workspace-selector__option-check']}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkspaceSelector;