'use client';

import Avatar from '@/components/atoms/Avatar/Avatar';
import StatusChip from '@/components/atoms/StatusChip/StatusChip';
import styles from './WorkspaceSSOIndicatorRow.module.scss';

const WorkspaceSSOIndicatorRow = ({
  companyName = 'Acme Corp',
  avatarInitial = 'A',
  ssoProvider = 'Microsoft Entra ID',
  ssoType = 'SAML',
  domains = ['@acmecorp.com', '@acme-contractors.com'],
  status = 'active',
  statusText = 'Active',
  onDisconnect,
  dashboardUrl = '#',
  className = ''
}) => {
  const handleDisconnectClick = (e) => {
    e.preventDefault();
    if (onDisconnect) {
      onDisconnect();
    }
  };

  const handleDashboardClick = (e) => {
    if (!dashboardUrl || dashboardUrl === '#') {
      e.preventDefault();
    }
  };

  const domainsDisplay = domains.join(', ');

  return (
    <div className={`${styles['workspace-sso-row']} ${className}`}>
      <div className={styles['workspace-sso-row__company']}>
        <Avatar 
          initial={avatarInitial}
          size="large"
          variant="dark"
          className={styles['workspace-sso-row__avatar']}
        />
        <div className={styles['workspace-sso-row__info']}>
          <h3 className={styles['workspace-sso-row__name']}>
            {companyName}
          </h3>
          <div className={styles['workspace-sso-row__details']}>
            <span className={styles['workspace-sso-row__provider']}>
              {ssoProvider} • {ssoType} • {domainsDisplay}
            </span>
            <StatusChip 
              text={statusText}
              status={status}
              className={styles['workspace-sso-row__status']}
            />
          </div>
        </div>
      </div>
      
      <div className={styles['workspace-sso-row__actions']}>
        <button
          className={`${styles['workspace-sso-row__button']} ${styles['workspace-sso-row__button--disconnect']}`}
          onClick={handleDisconnectClick}
          type="button"
          aria-label={`Disconnect SSO for ${companyName}`}
        >
          Disconnect SSO
        </button>
        
        <a
          href={dashboardUrl}
          className={`${styles['workspace-sso-row__button']} ${styles['workspace-sso-row__button--dashboard']}`}
          onClick={handleDashboardClick}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open WorkOS Dashboard for ${companyName}`}
        >
          WorkOS Dashboard
        </a>
      </div>
    </div>
  );
};

export default WorkspaceSSOIndicatorRow;