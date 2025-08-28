'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import TextField from '@/components/atoms/TextField/TextField';
import WorkspaceSelector from '@/components/molecules/WorkspaceSelector/WorkspaceSelector';
import Button from '@/components/atoms/Button/Button';
import styles from './SSOConnectionModal.module.scss';

const SSOConnectionModal = ({
  isOpen = false,
  onClose,
  onConnect,
  dashboardLink = 'https://dashboard.workos.com',
  emailDomainOptions = [], // Array of available email domains to select from
  className = ''
}) => {
  const [organizationId, setOrganizationId] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [selectedDomains, setSelectedDomains] = useState([]);
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleConnect = () => {
    const data = {
      organizationId,
      customSlug,
      emailDomains: selectedDomains
    };
    onConnect?.(data);
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles['sso-connection-modal']} ${className}`}>
      <div className={styles['sso-connection-modal__overlay']} />
      <div 
        ref={modalRef}
        className={styles['sso-connection-modal__container']}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sso-modal-title"
      >
        {/* Header */}
        <div className={styles['sso-connection-modal__header']}>
          <div className={styles['sso-connection-modal__header-content']}>
            <h2 
              id="sso-modal-title"
              className={styles['sso-connection-modal__title']}
            >
              Connect WorkOS Organization
            </h2>
            <p className={styles['sso-connection-modal__subtitle']}>
              Link an existing WorkOS organization to this Workspace
            </p>
          </div>
          <button
            className={styles['sso-connection-modal__close']}
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <Image 
              src="/cross.svg"
              alt=""
              width={16}
              height={16}
            />
          </button>
        </div>

        <div className={styles['sso-connection-modal__divider']} />

        {/* Banner */}
        <div className={styles['sso-connection-modal__banner']}>
          <h3 className={styles['sso-connection-modal__banner-title']}>
            Before you Begin
          </h3>
          <p className={styles['sso-connection-modal__banner-text']}>
            You'll need to have already created an organization in the WorkOS Dashboard and configured your SSO connection. 
            If you haven't done this yet, go to{' '}
            <a 
              href={dashboardLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles['sso-connection-modal__link']}
            >
              WorkOS Dashboard
            </a>.
          </p>
        </div>

        {/* Form Fields */}
        <div className={styles['sso-connection-modal__form']}>
          <div className={styles['sso-connection-modal__field-group']}>
            <TextField
              label="Organization ID"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              placeholder="org_01HEPCSUCBIEIKDMSBTG"
              className={styles['sso-connection-modal__field']}
            />
            <span className={styles['sso-connection-modal__helper']}>
              Find this in WorkOS Dashboard → Organizations → Your Organization
            </span>
          </div>

          <div className={styles['sso-connection-modal__field-group']}>
            <TextField
              label="Custom Slug (Optional)"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder="acme-corp"
              className={styles['sso-connection-modal__field']}
            />
            <span className={styles['sso-connection-modal__helper']}>
              For branded login URLs like ckye.ai/login/acme-corp
            </span>
          </div>

          <div className={styles['sso-connection-modal__field-group']}>
            <WorkspaceSelector
              label="Allowed email domains"
              placeholder="Select email domains..."
              options={emailDomainOptions}
              value={selectedDomains}
              onChange={setSelectedDomains}
              className={styles['sso-connection-modal__field']}
            />
            <span className={styles['sso-connection-modal__helper']}>
              Only users with these email domains can be invited
            </span>
          </div>
        </div>

        {/* Setup Checklist */}
        <div className={styles['sso-connection-modal__checklist']}>
          <h3 className={styles['sso-connection-modal__checklist-title']}>
            Setup Checklist
          </h3>
          <ol className={styles['sso-connection-modal__checklist-items']}>
            <li className={styles['sso-connection-modal__checklist-item']}>
              <span className={styles['sso-connection-modal__check']}>✓</span>
              Created organization in WorkOS Dashboard
            </li>
            <li className={styles['sso-connection-modal__checklist-item']}>
              <span className={styles['sso-connection-modal__check']}>✓</span>
              Configured SSO connection (Microsoft, Google, Okta, etc.)
            </li>
            <li className={styles['sso-connection-modal__checklist-item']}>
              <span className={styles['sso-connection-modal__check']}>✓</span>
              Tested authentication in WorkOS
            </li>
            <li className={styles['sso-connection-modal__checklist-item']}>
              <span className={styles['sso-connection-modal__arrow']}>→</span>
              Ready to connect to Ckye
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className={styles['sso-connection-modal__actions']}>
          <Button
            onClick={handleConnect}
            variant="secondary"
            className={styles['sso-connection-modal__button']}
            disabled={!organizationId}
          >
            Connect Workspace
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SSOConnectionModal;