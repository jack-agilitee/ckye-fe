'use client';

import { useState } from 'react';
import Image from 'next/image';
import User from '@/components/molecules/User/User';
import styles from './VariantsTable.module.scss';

const VariantsTable = ({ 
  variants = [],
  onRowClick,
  loading = false
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleRowClick = (variant) => {
    if (onRowClick) {
      onRowClick(variant);
    } else {
      // TODO: Open modal with variant details
      console.log('TODO: Open modal for variant:', variant);
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
      <div className={styles['variants-table']}>
        <div className={styles['variants-table__loading']}>
          Loading variants...
        </div>
      </div>
    );
  }

  if (!variants || variants.length === 0) {
    return (
      <div className={styles['variants-table']}>
        <div className={styles['variants-table__empty']}>
          No variants found
        </div>
      </div>
    );
  }

  return (
    <div className={styles['variants-table']}>
      <div className={styles['variants-table__header']}>
        <div className={styles['variants-table__header-cell']}>
          Name
        </div>
        <div className={styles['variants-table__header-cell']}>
          Created Date
        </div>
        <div className={styles['variants-table__header-cell']}>
          Created By
        </div>
        <div className={styles['variants-table__header-cell']}>
          Suggestion Summary
        </div>
        <div className={styles['variants-table__header-cell']}></div>
      </div>
      
      <div className={styles['variants-table__body']}>
        {variants.map((variant, index) => (
          <div 
            key={variant.id || index}
            className={`${styles['variants-table__row']} ${
              hoveredRow === index ? styles['variants-table__row--hovered'] : ''
            }`}
            onMouseEnter={() => setHoveredRow(index)}
            onMouseLeave={() => setHoveredRow(null)}
            onClick={() => handleRowClick(variant)}
          >
            <div className={styles['variants-table__cell']}>
              <div className={styles['variants-table__file-info']}>
                <div className={styles['variants-table__file-name']}>
                  {variant.fileName || 'Unnamed'}
                </div>
                <div className={styles['variants-table__file-variant']}>
                  {variant.variant || ''}
                </div>
              </div>
            </div>
            
            <div className={styles['variants-table__cell']}>
              <span className={styles['variants-table__date']}>
                {formatDate(variant.createdDate)}
              </span>
            </div>
            
            <div className={styles['variants-table__cell']}>
              <User 
                name={variant.createdBy?.name || 'Unknown User'}
                email={variant.createdBy?.email || ''}
                initial={variant.createdBy?.initial}
                className={styles['variants-table__user']}
              />
            </div>
            
            <div className={styles['variants-table__cell']}>
              <div className={styles['variants-table__summary']}>
                {truncateText(variant.summary || 'No summary available')}
              </div>
            </div>
            
            <div className={styles['variants-table__cell']}>
              <button 
                className={styles['variants-table__action']}
                aria-label={`View details for ${variant.fileName}`}
              >
                <Image 
                  src="/chevron-right.svg"
                  alt=""
                  width={24}
                  height={24}
                  className={styles['variants-table__icon']}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariantsTable;