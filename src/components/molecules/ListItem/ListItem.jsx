'use client';

import Image from 'next/image';
import styles from './ListItem.module.scss';

const ListItem = ({ 
  text, 
  icon = '/document.svg',
  selected = false,
  onClick,
  className = ''
}) => {
  return (
    <div 
      className={`${styles['list-item']} ${selected ? styles['list-item--selected'] : ''} ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className={styles['list-item__content']}>
        <div className={styles['list-item__icon']}>
          <Image 
            src={icon}
            alt=""
            width={16}
            height={16}
            className={styles['list-item__icon-image']}
          />
        </div>
        <span className={styles['list-item__text']}>
          {text}
        </span>
      </div>
    </div>
  );
};

export default ListItem;