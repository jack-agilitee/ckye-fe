import Link from 'next/link';
import styles from './SSOBanner.module.scss';

const SSOBanner = ({ 
  title = 'Before you Begin',
  description = "You'll need to have already created an organization in the WorkOS Dashboard and configured your SSO connection. If you haven't done this yet, ",
  linkText = 'go to WorkOS Dashboard.',
  linkUrl = 'https://dashboard.workos.com',
  linkTarget = '_blank',
  className = ''
}) => {
  const isExternalLink = linkTarget === '_blank';
  
  return (
    <div className={`${styles['sso-banner']} ${className}`}>
      <h3 className={styles['sso-banner__title']}>{title}</h3>
      <p className={styles['sso-banner__description']}>
        {description}
        {isExternalLink ? (
          <a 
            href={linkUrl}
            target={linkTarget}
            rel="noopener noreferrer"
            className={styles['sso-banner__link']}
          >
            {linkText}
          </a>
        ) : (
          <Link 
            href={linkUrl}
            className={styles['sso-banner__link']}
          >
            {linkText}
          </Link>
        )}
      </p>
    </div>
  );
};

export default SSOBanner;