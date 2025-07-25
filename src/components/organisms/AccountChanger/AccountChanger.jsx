'use client';

import Image from 'next/image';
import styles from './AccountChanger.module.scss';

const AccountChanger = ({ 
  accountName = 'Agilitee',
  accountInitial = 'A',
  onAccountClick,
  onNotesClick,
  isAdmin = false,
  onAdminBack
}) => {
  const handleAccountClick = () => {
    if (onAccountClick) {
      onAccountClick();
    }
  };

  const handleNotesClick = () => {
    if (onNotesClick) {
      onNotesClick();
    }
  };

  const handleAdminBack = () => {
    if (onAdminBack) {
      onAdminBack();
    }
  };

  // Admin variant
  if (isAdmin) {
    return (
      <div className={styles['account-changer']}>
        <div className={styles['account-changer__admin']}>
          <button 
            className={styles['account-changer__admin-back']}
            onClick={handleAdminBack}
            aria-label="Exit admin mode"
          >
            <Image 
              src="/chevron-left.svg"
              alt=""
              width={16}
              height={16}
              className={styles['account-changer__admin-chevron']}
            />
          </button>
          <span className={styles['account-changer__admin-text']}>
            Ckye Admin
          </span>
        </div>
      </div>
    );
  }

  // Default variant
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