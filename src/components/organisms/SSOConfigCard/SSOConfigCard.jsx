'use client';

import Image from 'next/image';
import WorkspaceSSOIndicatorRow from '@/components/molecules/WorkspaceSSOIndicatorRow/WorkspaceSSOIndicatorRow';
import styles from './SSOConfigCard.module.scss';

const SSOConfigCard = ({
  state = 'empty',
  companyName = 'American Eagle',
  title = 'SSO Configuration',
  description = 'Control who can access your Ckye workspace',
  onEnableSSO,
  onDisconnect,
  dashboardUrl = '#',
  // Props for connected state
  ssoProvider = 'Microsoft Entra ID',
  ssoType = 'SAML',
  domains = ['@acmecorp.com', '@acme-contractors.com'],
  ssoStatus = 'active',
  ssoStatusText = 'Active',
  avatarInitial = 'A',
  connectionId = 'con_01HQNFK5BN5TQHXP3S1P9HFMZG',
  createdDate = '8/26/2025',
  loginUrl = 'ckye.ai/login/acme-corp?sso',
  className = ''
}) => {
  const handleEnableClick = (e) => {
    e.preventDefault();
    if (onEnableSSO) {
      onEnableSSO();
    }
  };

  return (
    <div className={`${styles['sso-config-card']} ${className}`}>
      <div className={styles['sso-config-card__header']}>
        <div className={styles['sso-config-card__header-content']}>
          <h2 className={styles['sso-config-card__title']}>
            {title}
          </h2>
          <p className={styles['sso-config-card__description']}>
            {description}
          </p>
        </div>
      </div>

      {state === 'empty' ? (
        <div className={styles['sso-config-card__empty-state']}>
          <div className={styles['sso-config-card__icon-wrapper']}>
            <Image 
              src="/lock.svg"
              alt=""
              width={40}
              height={40}
              className={styles['sso-config-card__icon']}
            />
          </div>
          <h3 className={styles['sso-config-card__empty-title']}>
            Enable Single Sign-On for This Workspace
          </h3>
          <p className={styles['sso-config-card__empty-description']}>
            Connect via SAML or OIDC to enable secure and fully managed SSO authentication. Users of this Workspace will be required to sign in using their company&apos;s identity provider.
          </p>
          <button
            className={styles['sso-config-card__enable-button']}
            onClick={handleEnableClick}
            type="button"
            aria-label={`Enable SSO for ${companyName}`}
          >
            Enable SSO for {companyName}
          </button>
        </div>
      ) : (
        <div className={styles['sso-config-card__connected-state']}>
          <div className={styles['sso-config-card__sso-row']}>
            <WorkspaceSSOIndicatorRow
              companyName={companyName}
              avatarInitial={avatarInitial}
              ssoProvider={ssoProvider}
              ssoType={ssoType}
              domains={domains}
              status={ssoStatus}
              statusText={ssoStatusText}
              onDisconnect={onDisconnect}
              dashboardUrl={dashboardUrl}
            />
          </div>
          
          <div className={styles['sso-config-card__metadata']}>
            <div className={styles['sso-config-card__metadata-item']}>
              <span className={styles['sso-config-card__metadata-label']}>
                Connection ID:
              </span>
              <span className={styles['sso-config-card__metadata-value']}>
                {connectionId}
              </span>
            </div>
            <div className={styles['sso-config-card__metadata-item']}>
              <span className={styles['sso-config-card__metadata-label']}>
                Created:
              </span>
              <span className={styles['sso-config-card__metadata-value']}>
                {createdDate}
              </span>
            </div>
            <div className={styles['sso-config-card__metadata-item']}>
              <span className={styles['sso-config-card__metadata-label']}>
                Login URL:
              </span>
              <span className={styles['sso-config-card__metadata-value']}>
                {loginUrl}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SSOConfigCard;