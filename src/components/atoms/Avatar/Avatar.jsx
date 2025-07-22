'use client';

import styles from './Avatar.module.scss';

const Avatar = ({ 
  initial = 'A',
  size = 'medium',
  variant = 'default',
  className = ''
}) => {
  return (
    <div 
      className={`${styles.avatar} ${styles[`avatar--${size}`]} ${styles[`avatar--${variant}`]} ${className}`}
    >
      <span className={styles.avatar__initial}>
        {initial}
      </span>
    </div>
  );
};

export default Avatar;