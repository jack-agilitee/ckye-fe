import styles from './User.module.scss';

const User = ({ 
  name = '', 
  email = '', 
  initial = '',
  className = ''
}) => {
  // Generate initial from name if not provided
  const displayInitial = initial || (name ? name.charAt(0).toUpperCase() : '');

  return (
    <div className={`${styles.user} ${className}`}>
      <div className={styles['user__avatar']}>
        <span className={styles['user__avatar-initial']}>
          {displayInitial}
        </span>
      </div>
      <div className={styles['user__info']}>
        <div className={styles['user__name']}>{name}</div>
        <div className={styles['user__email']}>{email}</div>
      </div>
    </div>
  );
};

export default User;