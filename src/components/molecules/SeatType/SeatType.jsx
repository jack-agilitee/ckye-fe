import Image from 'next/image';
import styles from './SeatType.module.scss';

// Enum for seat types
export const SEAT_TYPES = {
  MEMBER: 'Member',
  EDITOR: 'Editor',
  ADMIN: 'Admin'
};

const SeatType = ({ 
  type = SEAT_TYPES.MEMBER,
  className = ''
}) => {
  // Configuration for each seat type
  const seatConfig = {
    [SEAT_TYPES.MEMBER]: {
      icon: '/eye.svg',
      text: 'Member',
      avatarClass: styles['seat-type__avatar--member']
    },
    [SEAT_TYPES.EDITOR]: {
      icon: '/edit.svg',
      text: 'Editor',
      avatarClass: styles['seat-type__avatar--editor']
    },
    [SEAT_TYPES.ADMIN]: {
      icon: '/lightning.svg',
      text: 'Admin',
      avatarClass: styles['seat-type__avatar--admin']
    }
  };

  const config = seatConfig[type] || seatConfig[SEAT_TYPES.MEMBER];

  return (
    <div className={`${styles['seat-type']} ${className}`}>
      <div className={`${styles['seat-type__avatar']} ${config.avatarClass}`}>
        <Image 
          src={config.icon}
          alt=""
          width={24}
          height={24}
          className={styles['seat-type__icon']}
        />
      </div>
      <span className={styles['seat-type__text']}>
        {config.text}
      </span>
    </div>
  );
};

export default SeatType;