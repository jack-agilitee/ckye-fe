'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './FilterModal.module.scss';

const FilterModal = ({ 
  filters = {},
  values = {},
  onChange,
  onClose,
  position = { top: 0, left: 0 }
}) => {
  const [localValues, setLocalValues] = useState(values);
  const modalRef = useRef(null);

  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleCheckboxChange = (filterKey, optionValue) => {
    const currentValues = localValues[filterKey] || [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(v => v !== optionValue)
      : [...currentValues, optionValue];
    
    const updatedValues = {
      ...localValues,
      [filterKey]: newValues
    };
    
    setLocalValues(updatedValues);
    onChange(updatedValues);
  };

  const handleRadioChange = (filterKey, optionValue) => {
    const updatedValues = {
      ...localValues,
      [filterKey]: optionValue
    };
    
    setLocalValues(updatedValues);
    onChange(updatedValues);
  };

  const handleTextChange = (filterKey, value) => {
    const updatedValues = {
      ...localValues,
      [filterKey]: value
    };
    
    setLocalValues(updatedValues);
    onChange(updatedValues);
  };

  const handleReset = () => {
    const resetValues = {};
    Object.keys(filters).forEach(key => {
      const filter = filters[key];
      if (filter.type === 'checkbox') {
        resetValues[key] = [];
      } else if (filter.type === 'radio') {
        resetValues[key] = '';
      } else if (filter.type === 'text') {
        resetValues[key] = '';
      }
    });
    
    setLocalValues(resetValues);
    onChange(resetValues);
  };

  const renderFilterOption = (filterKey, filter) => {
    if (filter.type === 'checkbox') {
      return (
        <div className={styles['filter-modal__filter-group']}>
          <div className={styles['filter-modal__filter-header']}>
            <span className={styles['filter-modal__filter-title']}>{filter.label}</span>
          </div>
          {filter.options.map((option) => (
            <label 
              key={option.value} 
              className={styles['filter-modal__filter-item']}
            >
              <input
                type="checkbox"
                className={styles['filter-modal__checkbox']}
                checked={(localValues[filterKey] || []).includes(option.value)}
                onChange={() => handleCheckboxChange(filterKey, option.value)}
              />
              <span className={styles['filter-modal__filter-label']}>{option.label}</span>
            </label>
          ))}
        </div>
      );
    }

    if (filter.type === 'radio') {
      return (
        <div className={styles['filter-modal__filter-group']}>
          <div className={styles['filter-modal__filter-header']}>
            <span className={styles['filter-modal__filter-title']}>{filter.label}</span>
          </div>
          {filter.options.map((option) => (
            <label 
              key={option.value} 
              className={styles['filter-modal__filter-item']}
            >
              <input
                type="radio"
                name={filterKey}
                className={styles['filter-modal__radio']}
                checked={localValues[filterKey] === option.value}
                onChange={() => handleRadioChange(filterKey, option.value)}
              />
              <span className={styles['filter-modal__filter-label']}>{option.label}</span>
            </label>
          ))}
        </div>
      );
    }

    if (filter.type === 'text') {
      return (
        <div className={styles['filter-modal__filter-group']}>
          <div className={styles['filter-modal__filter-header']}>
            <span className={styles['filter-modal__filter-title']}>{filter.label}</span>
          </div>
          <input
            type="text"
            className={styles['filter-modal__text-input']}
            placeholder={filter.placeholder || 'Contains...'}
            value={localValues[filterKey] || ''}
            onChange={(e) => handleTextChange(filterKey, e.target.value)}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div 
      ref={modalRef}
      className={styles['filter-modal']}
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
    >
      <div className={styles['filter-modal__header']}>
        <h3 className={styles['filter-modal__title']}>Filters</h3>
        <button 
          className={styles['filter-modal__reset']}
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      <div className={styles['filter-modal__divider']} />

      <div className={styles['filter-modal__content']}>
        {Object.keys(filters).map((filterKey) => (
          <div key={filterKey}>
            {renderFilterOption(filterKey, filters[filterKey])}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterModal;