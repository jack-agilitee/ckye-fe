'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './ListItem.module.scss';

const ListItem = ({ 
  text, 
  icon = '/document.svg',
  selected = false,
  onClick,
  onRename,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (onRename) {
      setIsEditing(true);
      setEditValue(text);
    }
  };

  const handleSubmit = () => {
    if (editValue.trim() && editValue !== text) {
      onRename?.(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={`${styles['list-item']} ${selected ? styles['list-item--selected'] : ''} ${className}`}
      onClick={onClick}
      onDoubleClick={handleDoubleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (!isEditing && (e.key === 'Enter' || e.key === ' ')) {
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
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            onClick={handleInputClick}
            className={styles['list-item__input']}
          />
        ) : (
          <span className={styles['list-item__text']}>
            {text}
          </span>
        )}
      </div>
    </div>
  );
};

export default ListItem;