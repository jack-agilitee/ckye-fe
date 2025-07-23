import styles from './AuthPage.module.scss';

const AuthPage = ({ leftContent, rightContent, className = '' }) => {
  return (
    <div className={`${styles['auth-page']} ${className}`}>
      <div className={styles['auth-page__left']}>
        {leftContent || (
          <div className={styles['auth-page__placeholder']}>
            <h3 className={styles['auth-page__placeholder-title']}>Left Navigation</h3>
            <p className={styles['auth-page__placeholder-text']}>Add your navigation component here</p>
          </div>
        )}
      </div>
      <div className={styles['auth-page__right']}>
        {rightContent || (
          <div className={styles['auth-page__placeholder']}>
            <h3 className={styles['auth-page__placeholder-title']}>Main Content</h3>
            <p className={styles['auth-page__placeholder-text']}>Add your main content component here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;