import styles from './TwoColumnPage.module.scss';

const TwoColumnPage = ({ leftContent, rightContent, className = '' }) => {
  return (
    <div className={`${styles['two-column-page']} ${className}`}>
      <div className={styles['two-column-page__left']}>
        {leftContent || (
          <div className={styles['two-column-page__placeholder']}>
            <h3 className={styles['two-column-page__placeholder-title']}>Left Navigation</h3>
            <p className={styles['two-column-page__placeholder-text']}>Add your navigation component here</p>
          </div>
        )}
      </div>
      <div className={styles['two-column-page__right']}>
        {rightContent || (
          <div className={styles['two-column-page__placeholder']}>
            <h3 className={styles['two-column-page__placeholder-title']}>Main Content</h3>
            <p className={styles['two-column-page__placeholder-text']}>Add your main content component here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoColumnPage;