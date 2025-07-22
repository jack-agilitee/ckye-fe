'use client';

import Image from 'next/image';
import styles from './Chip.module.scss';

const Chip = ({ 
  text = 'James Otey',
  onDismiss,
  className = ''
}) => {
  const handleClick = (e) => {
    if (onDismiss) {
      onDismiss(e);
    }
  };

  return (
    <button
      className={`${styles.chip} ${className}`}
      onClick={handleClick}
      type="button"
      aria-label={`Dismiss ${text}`}
    >
      <span className={styles.chip__text}>
        {text}
      </span>
      <Image 
        src="/close.svg"
        alt=""
        width={12}
        height={12}
        className={styles.chip__icon}
      />
    </button>
  );
};

export default Chip;