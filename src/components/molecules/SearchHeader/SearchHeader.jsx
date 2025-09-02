'use client';

import { useRef } from 'react';
import Image from 'next/image';
import SearchBar from '@/components/atoms/SearchBar/SearchBar';
import Button from '@/components/atoms/Button/Button';
import styles from './SearchHeader.module.scss';

const SearchHeader = ({ 
  title = 'Users',
  searchPlaceholder = 'Search Users',
  onSearch,
  searchValue,
  onSearchChange,
  buttonText = 'Add Users',
  onButtonClick,
  className = '',
  showFilter = false,
  onFilterClick,
  filterButtonRef
}) => {
  return (
    <div className={`${styles['search-header']} ${className}`}>
      <h1 className={styles['search-header__title']}>{title}</h1>
      
      <div className={styles['search-header__controls']}>
        <div className={styles['search-header__search-group']}>
          <SearchBar 
            placeholder={searchPlaceholder}
            onSearch={onSearch}
            value={searchValue}
            onChange={onSearchChange}
            className={styles['search-header__search']}
          />
          
          {showFilter && (
            <button
              ref={filterButtonRef}
              className={styles['search-header__filter-button']}
              onClick={onFilterClick}
              aria-label="Filter"
            >
              <Image
                src="/filter.svg"
                alt="Filter"
                width={16}
                height={16}
              />
            </button>
          )}
        </div>
        
        <Button 
          variant="secondary"
          icon="/people-add.svg"
          onClick={onButtonClick}
          className={styles['search-header__button']}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default SearchHeader;