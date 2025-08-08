'use client';

import { useRouter } from 'next/navigation';
import Avatar from '@/components/atoms/Avatar/Avatar';
import styles from './VariantsTable.module.scss';

const VariantsTable = ({ variants = [], company = '' }) => {
  const router = useRouter();

  const handleRowClick = (variant) => {
    console.log('Variant clicked:', variant);
    // TODO: Navigate to variant detail or open modal
  };

  return (
    <div className={styles['variants-table']}>
      {/* Table Header */}
      <div className={styles['variants-table__header']}>
        <div className={styles['variants-table__header-cell']}>
          <span className={styles['variants-table__header-text']}>Name</span>
        </div>
        <div className={styles['variants-table__header-cell']}>
          <span className={styles['variants-table__header-text']}>Created Date</span>
        </div>
        <div className={styles['variants-table__header-cell']}>
          <span className={styles['variants-table__header-text']}>Created By</span>
        </div>
        <div className={styles['variants-table__header-cell']}>
          <span className={styles['variants-table__header-text']}>Suggestion Summary</span>
        </div>
        <div className={styles['variants-table__header-cell--action']}>
          <span className={styles['variants-table__header-text']}>&nbsp;</span>
        </div>
      </div>

      {/* Table Body */}
      <div className={styles['variants-table__body']}>
        {variants.map((variant, index) => (
          <div 
            key={variant.id || index} 
            className={styles['variants-table__row']}
            onClick={() => handleRowClick(variant)}
          >
            {/* Name Column */}
            <div className={styles['variants-table__cell']}>
              <div className={styles['variants-table__name-group']}>
                <span className={styles['variants-table__name']}>{variant.name}</span>
                <span className={styles['variants-table__variant-label']}>{variant.variantLabel}</span>
              </div>
            </div>

            {/* Created Date Column */}
            <div className={styles['variants-table__cell']}>
              <span className={styles['variants-table__date']}>{variant.createdDate}</span>
            </div>

            {/* Created By Column */}
            <div className={styles['variants-table__cell']}>
              <div className={styles['variants-table__user']}>
                <Avatar 
                  initial={variant.createdBy.initial} 
                  className={styles['variants-table__avatar']}
                />
                <div className={styles['variants-table__user-info']}>
                  <span className={styles['variants-table__user-name']}>{variant.createdBy.name}</span>
                  <span className={styles['variants-table__user-email']}>{variant.createdBy.email}</span>
                </div>
              </div>
            </div>

            {/* Suggestion Summary Column */}
            <div className={styles['variants-table__cell']}>
              <span className={styles['variants-table__summary']}>{variant.summary}</span>
            </div>

            {/* Action Column */}
            <div className={styles['variants-table__cell--action']}>
              <button className={styles['variants-table__action-button']}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariantsTable;