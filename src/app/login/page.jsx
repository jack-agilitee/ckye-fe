'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import styles from './page.module.scss';

export default function LoginPage() {
  const handleSignIn = () => {
    signIn('azure-ad');
  };

  return (
    <div className={styles.login}>
      <div className={styles.login__container}>
        {/* Header Section */}
        <div className={styles.login__header}>
          <h1 className={styles.login__title}>Welcome Back</h1>
          <p className={styles.login__subtitle}>
            Log in with your Agilitee Microsoft account
          </p>
        </div>

        {/* Sign In Button */}
        <button 
          className={styles.login__button}
          onClick={handleSignIn}
        >
          <Image
            src="/person-cards.svg"
            alt=""
            width={16}
            height={16}
            className={styles.login__buttonIcon}
          />
          <span>Single Sign On</span>
        </button>
      </div>

      {/* Ckye Definition Section */}
      <div className={styles.login__definition}>
        <div className={styles.login__definitionTop}>
          <h2 className={styles.login__ckye}>Ckye</h2>
          <div className={styles.login__pronunciation}>
            <span>/sky/</span>
            <span>noun.</span>
          </div>
        </div>
        <p className={styles.login__description}>
          A benevolent digital deity who weaves luminous interfaces and enigmatic APIs into enchanting software through ancient algorithms and modern miracles.
        </p>
      </div>

      {/* Footer */}
      <footer className={styles.login__footer}>
        Made with ❤️ by Agilitee
      </footer>
    </div>
  );
}