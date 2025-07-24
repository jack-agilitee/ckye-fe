'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import User from '@/components/molecules/User/User';
import Avatar from '@/components/atoms/Avatar/Avatar';
import Button from '@/components/atoms/Button/Button';
import styles from './SettingsModal.module.scss';

const SettingsModal = ({ 
  workspaces = [],
  currentWorkspaceId = null,
  onDismiss
}) => {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(currentWorkspaceId);
  const modalRef = useRef(null);
  const { data: session } = useSession();

  // Get current workspace data
  const currentWorkspace = workspaces.find(w => w.id === selectedWorkspaceId) || workspaces[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onDismiss?.();
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onDismiss?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onDismiss]);

  const handleSettingsClick = () => {
    console.log('settings');
    // TODO: Navigate to settings page
  };

  const handleInviteMembersClick = () => {
    console.log('invite members');
    // TODO: Navigate to invite members page
  };

  const handleWorkspaceClick = (workspace) => {
    setSelectedWorkspaceId(workspace.id);
  };

  const handleLogoutClick = () => {
    signOut();
  };

  return (
    <div className={styles['settings-modal']} ref={modalRef}>
      {/* Current Workspace Header */}
      <User 
        name={currentWorkspace?.name || 'Workspace'}
        email={`${currentWorkspace?.memberCount || 0} Members`}
        initial={currentWorkspace?.name?.charAt(0) || 'A'}
        className={styles['settings-modal__workspace']}
      />

      {/* Action Buttons */}
      <div className={styles['settings-modal__actions']}>
        <Button
          variant="secondary"
          icon="/settings.svg"
          onClick={handleSettingsClick}
          className={styles['settings-modal__action-button']}
        >
          Settings
        </Button>
        <Button
          variant="secondary"
          icon="/people-add.svg"
          onClick={handleInviteMembersClick}
          className={styles['settings-modal__action-button']}
        >
          Invite Members
        </Button>
      </div>

      <div className={styles['settings-modal__divider']} />

      {/* User Email */}
      <div className={styles['settings-modal__user-email']}>
        {session?.user?.email || ''}
      </div>

      {/* Workspace List */}
      <div className={styles['settings-modal__workspace-list']}>
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className={`${styles['settings-modal__workspace-item']} ${
              selectedWorkspaceId === workspace.id ? styles['settings-modal__workspace-item--selected'] : ''
            }`}
            onClick={() => handleWorkspaceClick(workspace)}
          >
            <div className={styles['settings-modal__workspace-item-left']}>
              <Avatar
                initial={workspace.name.charAt(0)}
                size="small"
              />
              <span className={styles['settings-modal__workspace-item-name']}>
                {workspace.name}
              </span>
            </div>
            {selectedWorkspaceId === workspace.id && (
              <Image
                src="/check.svg"
                alt=""
                width={16}
                height={16}
                className={styles['settings-modal__workspace-item-check']}
              />
            )}
          </div>
        ))}
      </div>

      <div className={styles['settings-modal__divider']} />

      {/* Logout Button */}
      <button
        className={styles['settings-modal__logout']}
        onClick={handleLogoutClick}
      >
        <Image
          src="/log-out.svg"
          alt=""
          width={16}
          height={16}
          className={styles['settings-modal__logout-icon']}
        />
        <span className={styles['settings-modal__logout-text']}>
          Log Out
        </span>
      </button>
    </div>
  );
};

export default SettingsModal;