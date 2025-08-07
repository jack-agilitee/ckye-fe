'use client';

import { useState } from 'react';
import Image from 'next/image';
import Avatar from '@/components/atoms/Avatar/Avatar';
import styles from './SuggestionsTable.module.scss';

const SuggestionsTable = ({ 
  suggestions = [],
  onRowClick,
  loading = false
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleRowClick = (suggestion) => {
    if (onRowClick) {
      onRowClick(suggestion);
    } else {
      // TODO: Open modal with suggestion details
      console.log('TODO: Open modal for suggestion:', suggestion);
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className={styles['suggestions-table']}>
        <div className={styles['suggestions-table__loading']}>
          Loading suggestions...
        </div>
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className={styles['suggestions-table']}>
        <div className={styles['suggestions-table__empty']}>
          No suggestions found
        </div>
      </div>
    );
  }

  return (
    <div className={styles['suggestions-table']}>
      <div className={styles['suggestions-table__header']}>
        <div className={styles['suggestions-table__header-cell']}>
          Name
        </div>
        <div className={styles['suggestions-table__header-cell']}>
          Created Date
        </div>
        <div className={styles['suggestions-table__header-cell']}>
          Created By
        </div>
        <div className={styles['suggestions-table__header-cell']}>
          Suggestion Summary
        </div>
        <div className={styles['suggestions-table__header-cell']}></div>
      </div>
      
      <div className={styles['suggestions-table__body']}>
        {suggestions.map((suggestion, index) => (
          <div 
            key={suggestion.id || index}
            className={`${styles['suggestions-table__row']} ${
              hoveredRow === index ? styles['suggestions-table__row--hovered'] : ''
            }`}
            onMouseEnter={() => setHoveredRow(index)}
            onMouseLeave={() => setHoveredRow(null)}
            onClick={() => handleRowClick(suggestion)}
          >
            <div className={styles['suggestions-table__cell']}>
              <div className={styles['suggestions-table__file-info']}>
                <div className={styles['suggestions-table__file-name']}>
                  {suggestion.fileName || 'Unnamed'}
                </div>
                <div className={styles['suggestions-table__file-variant']}>
                  {suggestion.variant || ''}
                </div>
              </div>
            </div>
            
            <div className={styles['suggestions-table__cell']}>
              <span className={styles['suggestions-table__date']}>
                {formatDate(suggestion.createdDate)}
              </span>
            </div>
            
            <div className={styles['suggestions-table__cell']}>
              <div className={styles['suggestions-table__user']}>
                <Avatar 
                  initial={suggestion.createdBy?.initial || suggestion.createdBy?.name?.charAt(0) || 'U'}
                  size="small"
                  className={styles['suggestions-table__avatar']}
                />
                <div className={styles['suggestions-table__user-info']}>
                  <div className={styles['suggestions-table__user-name']}>
                    {suggestion.createdBy?.name || 'Unknown User'}
                  </div>
                  {suggestion.createdBy?.email && (
                    <div className={styles['suggestions-table__user-email']}>
                      {suggestion.createdBy?.email}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className={styles['suggestions-table__cell']}>
              <div className={styles['suggestions-table__summary']}>
                {truncateText(suggestion.summary || 'No summary available')}
              </div>
            </div>
            
            <div className={styles['suggestions-table__cell']}>
              <button 
                className={styles['suggestions-table__action']}
                aria-label={`View details for ${suggestion.fileName}`}
              >
                <Image 
                  src="/chevron-right.svg"
                  alt=""
                  width={24}
                  height={24}
                  className={styles['suggestions-table__icon']}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsTable;