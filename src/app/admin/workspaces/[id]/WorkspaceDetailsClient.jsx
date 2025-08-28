'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UsersTable from '@/components/templates/UsersTable/UsersTable';
import SSOConfigCard from '@/components/organisms/SSOConfigCard/SSOConfigCard';
import AddUserModal from '@/components/organisms/AddUserModal/AddUserModal';
import SSOConnectionModal from '@/components/organisms/SSOConnectionModal/SSOConnectionModal';
import Button from '@/components/atoms/Button/Button';
import styles from './WorkspaceDetailsClient.module.scss';

const WorkspaceDetailsClient = ({ workspace }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isSSOModalOpen, setIsSSOModalOpen] = useState(false);

  const handleAddUser = async (userData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          workspaceId: workspace.id
        })
      });

      if (response.ok) {
        setIsAddUserModalOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleSSOConnect = async (ssoData) => {
    try {
      // TODO: Implement SSO connection API
      console.log('Connecting SSO:', ssoData);
      setIsSSOModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error connecting SSO:', error);
    }
  };

  const emailDomainOptions = [
    { id: '1', name: '@americaneagle.com' },
    { id: '2', name: '@ae.com' }
  ];

  return (
    <div className={styles['workspace-details']}>
      {/* Header */}
      <div className={styles['workspace-details__header']}>
        <h1 className={styles['workspace-details__title']}>
          {workspace.name} Settings
        </h1>
      </div>

      {/* Tabs */}
      <div className={styles['workspace-details__tabs']}>
        <button
          className={`${styles['workspace-details__tab']} ${
            activeTab === 'users' ? styles['workspace-details__tab--active'] : ''
          }`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`${styles['workspace-details__tab']} ${
            activeTab === 'authentication' ? styles['workspace-details__tab--active'] : ''
          }`}
          onClick={() => setActiveTab('authentication')}
        >
          Authentication
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles['workspace-details__content']}>
        {activeTab === 'users' && (
          <div className={styles['workspace-details__users']}>
            <div className={styles['workspace-details__users-header']}>
              <h2 className={styles['workspace-details__section-title']}>Users</h2>
              <Button
                variant="primary"
                onClick={() => setIsAddUserModalOpen(true)}
                icon="/people-add.svg"
              >
                Add Users
              </Button>
            </div>
            <UsersTable 
              users={workspace.users || []} 
              showWorkspaces={false}
            />
          </div>
        )}

        {activeTab === 'authentication' && (
          <div className={styles['workspace-details__authentication']}>
            {workspace.ssoEnabled ? (
              <SSOConfigCard
                state="connected"
                companyName={workspace.name}
                ssoProvider="WorkOS"
                domains={workspace.ssoEmailDomains || []}
                onDisconnect={() => console.log('Disconnect SSO')}
              />
            ) : (
              <div className={styles['workspace-details__sso-empty']}>
                <SSOConfigCard
                  state="empty"
                  companyName={workspace.name}
                  onEnableSSO={() => setIsSSOModalOpen(true)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {isAddUserModalOpen && (
        <AddUserModal
          closeModal={() => setIsAddUserModalOpen(false)}
          addUsers={handleAddUser}
          workspace={workspace.name}
          workspaces={[]}
        />
      )}

      <SSOConnectionModal
        isOpen={isSSOModalOpen}
        onClose={() => setIsSSOModalOpen(false)}
        onConnect={handleSSOConnect}
        emailDomainOptions={emailDomainOptions}
      />
    </div>
  );
};

export default WorkspaceDetailsClient;