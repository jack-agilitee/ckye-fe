'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './InteractiveIcon.module.scss';

const InteractiveIcon = ({ 
  onClick,
  ariaLabel = 'More options',
  size = 'medium',
  disabled = false,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  const sizeMap = {
    small: 12,
    medium: 16,
    large: 20
  };

  const iconSize = sizeMap[size] || sizeMap.medium;

  return (
    <button
      className={`${styles['interactive-icon']} ${styles[`interactive-icon--${size}`]} ${
        isHovered ? styles['interactive-icon--hover'] : ''
      } ${disabled ? styles['interactive-icon--disabled'] : ''} ${className}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      aria-label={ariaLabel}
      type="button"
    >
      <Image 
        src="/dots.svg"
        alt=""
        width={iconSize}
        height={iconSize}
        className={styles['interactive-icon__icon']}
      />
    </button>
  );
};

export default InteractiveIcon;