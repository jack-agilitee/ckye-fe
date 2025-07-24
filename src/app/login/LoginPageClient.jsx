'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import styles from './LoginPageClient.module.scss';

export default function LoginPageClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      // Redirect to dashboard if already logged in
      router.push('/dashboard/aeo');
    }
  }, [session, router]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      // Use NextAuth to sign in with Azure AD
      const result = await signIn('azure-ad', {
        callbackUrl: '/dashboard/aeo',
        redirect: false,
      });

      if (result?.error) {
        console.error('Sign in error:', result.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignIn();
    }
  };

  // Show loading while checking authentication status
  if (status === 'loading') {
    return (
      <div className={styles.login}>
        <div className={styles.login__loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.login}>
      <div className={styles.login__wrapper}>
        <div className={styles.login__top}>
          <div className={styles.login__header}>
            <h1 className={styles.login__title}>Welcome Back</h1>
            <p className={styles.login__subtitle}>
              Log in with your Agilitee Microsoft account
            </p>
          </div>
          
          <div className={styles.login__field}>
            <label className={styles.login__label}>Email</label>
            <input
              type="email"
              className={styles.login__input}
              value={email}
              onChange={handleEmailChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.login__ctas}>
          <button 
            className={styles.login__button}
            onClick={handleSignIn}
            disabled={isLoading}
          >
            <svg
              className={styles.login__icon}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.6 1H2C1.44772 1 1 1.44772 1 2V7.6C1 8.15228 1.44772 8.6 2 8.6H7.6C8.15228 8.6 8.6 8.15228 8.6 7.6V2C8.6 1.44772 8.15228 1 7.6 1Z"
                fill="#F25022"
              />
              <path
                d="M14 1H8.4C7.84772 1 7.4 1.44772 7.4 2V7.6C7.4 8.15228 7.84772 8.6 8.4 8.6H14C14.5523 8.6 15 8.15228 15 7.6V2C15 1.44772 14.5523 1 14 1Z"
                fill="#7FBA00"
              />
              <path
                d="M7.6 7.4H2C1.44772 7.4 1 7.84772 1 8.4V14C1 14.5523 1.44772 15 2 15H7.6C8.15228 15 8.6 14.5523 8.6 14V8.4C8.6 7.84772 8.15228 7.4 7.6 7.4Z"
                fill="#00A4EF"
              />
              <path
                d="M14 7.4H8.4C7.84772 7.4 7.4 7.84772 7.4 8.4V14C7.4 14.5523 7.84772 15 8.4 15H14C14.5523 15 15 14.5523 15 14V8.4C15 7.84772 14.5523 7.4 14 7.4Z"
                fill="#FFB900"
              />
            </svg>
            <span>{isLoading ? 'Signing in...' : 'Single Sign On'}</span>
          </button>
        </div>
      </div>

      <div className={styles.login__definition}>
        <div className={styles.login__brand}>
          <h2 className={styles.login__logo}>Ckye</h2>
          <div className={styles.login__pronunciation}>
            <span>/sky/</span>
            <span>noun.</span>
          </div>
        </div>
        <p className={styles.login__description}>
          A benevolent digital deity who weaves luminous interfaces and
          enigmatic APIs into enchanting software through ancient algorithms
          and modern miracles.
        </p>
      </div>

      <p className={styles.login__footer}>
        Made with ❤️ by Agilitee
      </p>
    </div>
  );
}