'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './Chip.module.scss';

const Chip = ({ 
  text = 'James Otey',
  onDismiss,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    if (onDismiss) {
      onDismiss(e);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      className={`${styles.chip} ${isHovered ? styles['chip--hovered'] : ''} ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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