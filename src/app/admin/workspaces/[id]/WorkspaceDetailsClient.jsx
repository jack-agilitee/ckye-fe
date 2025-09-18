'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser, getUserByEmail } from '@/lib/api/users';
import { addUserToWorkspace } from '@/lib/api/workspaces';
import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';
import UsersTable from '@/components/templates/UsersTable/UsersTable';
import SSOConfigCard from '@/components/organisms/SSOConfigCard/SSOConfigCard';
import AddUserModal from '@/components/organisms/AddUserModal/AddUserModal';
import EditUserModal from '@/components/organisms/EditUserModal/EditUserModal';
import SSOConnectionModal from '@/components/organisms/SSOConnectionModal/SSOConnectionModal';
import styles from './WorkspaceDetailsClient.module.scss';

const WorkspaceDetailsClient = ({ workspace }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSSOModalOpen, setIsSSOModalOpen] = useState(false);

  // Filter users based on search query
  const filteredUsers = workspace.users?.filter(user => {
    const query = searchQuery?.toLowerCase();
    return user.name?.toLowerCase().includes(query) || 
           user.email?.toLowerCase().includes(query);
  }) || [];

  const handleAddUser = async (userData) => {
    try {
      // First check if the user already exists
      let user;
      try {
        const existingUser = await getUserByEmail(userData.email);
        user = existingUser.data;
      } catch (error) {
        // User doesn't exist, so create them
        user = null;
      }

      if (user) {
        // User exists, just add them to the workspace
        await addUserToWorkspace(user.id, workspace.id, userData.userType === 'Admin' ? 'admin' : 'member');
      } else {
        // User doesn't exist, create them with the workspace
        await createUser({
          ...userData,
          workspaceIds: [workspace.id]
        });
      }

      setIsAddUserModalOpen(false);
      router.refresh();
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

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
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
            <SearchHeader
              title="Users"
              searchPlaceholder="Search Users"
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              buttonText="Add Users"
              onButtonClick={() => setIsAddUserModalOpen(true)}
            />
            <UsersTable 
              users={filteredUsers} 
              showWorkspaces={false}
              onUserClick={handleUserClick}
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

      <EditUserModal
        user={selectedUser}
        isOpen={isEditUserModalOpen}
        onClose={() => {
          setIsEditUserModalOpen(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
};

export default WorkspaceDetailsClient;