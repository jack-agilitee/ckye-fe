'use client';

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
  className = ''
}) => {
  return (
    <div className={`${styles['search-header']} ${className}`}>
      <h1 className={styles['search-header__title']}>{title}</h1>
      
      <div className={styles['search-header__controls']}>
        <SearchBar 
          placeholder={searchPlaceholder}
          onSearch={onSearch}
          value={searchValue}
          onChange={onSearchChange}
          className={styles['search-header__search']}
        />
        
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