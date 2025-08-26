'use client';

import styles from './StatusChip.module.scss';

const StatusChip = ({ 
  text = 'Active',
  status = 'active',
  className = ''
}) => {
  return (
    <span 
      className={`${styles['status-chip']} ${styles[`status-chip--${status}`]} ${className}`}
      role="status"
      aria-label={`Status: ${text}`}
    >
      <span className={styles['status-chip__text']}>
        {text}
      </span>
    </span>
  );
};

export default StatusChip;