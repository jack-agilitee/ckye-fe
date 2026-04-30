'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@/context/UserContext';
import { usePathname } from 'next/navigation'
import { createUser, getUserByEmail } from '@/lib/api/users';
import { addUserToWorkspace } from '@/lib/api/workspaces';
import User from '@/components/molecules/User/User';
import Avatar from '@/components/atoms/Avatar/Avatar';
import Button from '@/components/atoms/Button/Button';
import AddUserModal from '@/components/organisms/AddUserModal/AddUserModal';
import styles from './SettingsModal.module.scss';

const SettingsModal = ({ onDismiss }) => {

  const modalRef = useRef(null);
  const router = useRouter();
  const { data: session } = useSession();
  const { workspaces } = useUser();
  const pathname = usePathname().split('/')?.pop()?.toLowerCase();

  const [currentWorkspace, setCurrentWorkspace] = useState(workspaces.find(workspace => workspace.shortName.toLowerCase() === pathname) || workspaces[0]);
  const [showModal, setShowModal] = useState(false);

  console.log(currentWorkspace)


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
    if (currentWorkspace?.id) {
      router.push(`/admin/workspaces/${currentWorkspace.id}`);
      onDismiss?.();
    }
  };

  const handleInviteMembersClick = () => {
    if (currentWorkspace?.id) {
      setShowModal(true);
    }
  };

  const handleWorkspaceClick = (workspace) => {
    setCurrentWorkspace(workspace);
  };

  useEffect(() => {
    if (currentWorkspace?.shortName?.toLowerCase() !== pathname) {
      if (currentWorkspace?.shortName) {
        router.push(`/dashboard/${currentWorkspace.shortName}`);
        onDismiss?.(); // Close the modal after navigation
      }
    }
  }, [currentWorkspace]);

  const handleLogoutClick = () => {
    signOut();
  };

  const handleAddUser = async (userData) => {
    try {
      let user;
      try {
        const existingUser = await getUserByEmail(userData.email);
        user = existingUser.data;
      } catch (error) {
        user = null;
      }

      if (user) {
        await addUserToWorkspace(user.id, currentWorkspace.id, userData.userType === 'Admin' ? 'admin' : 'member');
      } else {
        await createUser({
          ...userData,
          workspaceIds: [currentWorkspace.id]
        });
      }

      setShowModal(false);
      router.refresh();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className={styles['settings-modal']} ref={modalRef}>
      {/* Current Workspace Header */}
      <User
        name={currentWorkspace?.name || 'Workspace'}
        email={`${currentWorkspace?.userCount || 0} Members`}
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
            className={`${styles['settings-modal__workspace-item']} ${currentWorkspace?.id === workspace.id ? styles['settings-modal__workspace-item--selected'] : ''
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
            {currentWorkspace?.id === workspace.id && (
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

      {showModal && (
        <AddUserModal
          closeModal={() => setShowModal(false)}
          workspace={currentWorkspace}
          addUsers={handleAddUser}
        />
      )}
    </div>
  );
};

export default SettingsModal;