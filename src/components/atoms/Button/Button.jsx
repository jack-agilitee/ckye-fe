'use client';

import Image from 'next/image';
import styles from './Button.module.scss';

const Button = ({ 
  children,
  variant = 'primary',
  icon = '/settings.svg',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) => {
  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={`${styles.button} ${styles[`button--${variant}`]} ${disabled ? styles['button--disabled'] : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {icon && (
        <Image 
          src={icon}
          alt=""
          width={16}
          height={16}
          className={styles.button__icon}
        />
      )}
      <span className={styles.button__text}>
        {children}
      </span>
    </button>
  );
};

export default Button;