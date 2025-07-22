'use client';

import Image from 'next/image';
import styles from './AccountChanger.module.scss';

const AccountChanger = ({ 
  accountName = 'Agilitee',
  accountInitial = 'A',
  onAccountClick,
  onNotesClick
}) => {
  const handleAccountClick = () => {
    console.log('Account dropdown clicked - TODO: Open modal');
    if (onAccountClick) {
      onAccountClick();
    }
  };

  const handleNotesClick = () => {
    console.log('Notes button clicked - TODO: Create new document');
    if (onNotesClick) {
      onNotesClick();
    }
  };

  return (
    <div className={styles['account-changer']}>
      <button 
        className={styles['account-changer__account']}
        onClick={handleAccountClick}
        aria-label={`Switch account from ${accountName}`}
      >
        <div className={styles['account-changer__avatar']}>
          <span className={styles['account-changer__avatar-text']}>
            {accountInitial}
          </span>
        </div>
        <div className={styles['account-changer__name-wrapper']}>
          <span className={styles['account-changer__name']}>
            {accountName}
          </span>
          <Image 
            src="/chevron-down.svg"
            alt=""
            width={16}
            height={16}
            className={styles['account-changer__chevron']}
          />
        </div>
      </button>
      <button 
        className={styles['account-changer__notes-button']}
        onClick={handleNotesClick}
        aria-label="Create new note"
      >
        <Image 
          src="/note.svg"
          alt=""
          width={16}
          height={16}
          className={styles['account-changer__notes-icon']}
        />
      </button>
    </div>
  );
};

export default AccountChanger;