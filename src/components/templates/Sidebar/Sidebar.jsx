'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { SEAT_TYPES } from '@/components/molecules/SeatType/SeatType'
import AccountChanger from '@/components/organisms/AccountChanger/AccountChanger';
import ListItem from '@/components/molecules/ListItem/ListItem';
import InlineInput from '@/components/atoms/InlineInput/InlineInput';
import styles from './Sidebar.module.scss';

const Sidebar = ({ 
  contextItems = [],
  selectedItemId = null,
  isAdminMode = false,
  accountName = 'AEO',
  accountInitial = 'A',
  onContextItemClick,
  onAddNewClick,
  onAccountClick,
  onNotesClick,
  onAdminBack,
  isAddingNew = false,
  onCreateNew,
  onCancelNew
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  
  // Determine if user is admin based on userType from UserContext
  const isAdmin = user?.userType === SEAT_TYPES.ADMIN;

  const handleContextItemClick = (item) => {
    if (onContextItemClick) {
      onContextItemClick(item);
    }
  };

  const handleAddNewClick = () => {
    if (onAddNewClick) {
      onAddNewClick();
    }
  };

  const handleSettingsClick = () => {
    console.log('Settings');
    // TODO: Navigate to settings page
  };

  const handleInviteMembersClick = () => {
    console.log('Invite Members');
    // TODO: Navigate to invite members page
  };

  const handleAdminClick = () => {
    router.push('/admin/workspaces');
  };

  const handleWorkspacesClick = () => {
    router.push('/admin/workspaces');
  };

  const handleUsersClick = () => {
    router.push('/admin/users');
  };

  const handleAdminBack = () => {
    if (onAdminBack) {
      onAdminBack();
    } else {
      router.push('/');
    }
  };


  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar__header}>
        <AccountChanger
          accountName={accountName}
          accountInitial={accountInitial}
          onAccountClick={onAccountClick}
          onNotesClick={onNotesClick}
          isAdmin={isAdminMode}
          onAdminBack={handleAdminBack}
        />
      </div>

      <div className={styles.sidebar__content}>
        {isAdminMode ? (
          // Admin Mode Content
          <div className={styles.sidebar__sections}>
            <div className={styles.sidebar__section}>
              <div className={styles.sidebar__sectionContent}>
                <ListItem
                  text="Workspaces"
                  icon="/box.svg"
                  selected={pathname === '/admin/workspaces'}
                  onClick={handleWorkspacesClick}
                />
                <ListItem
                  text="Users"
                  icon="/person.svg"
                  selected={pathname === '/admin/users'}
                  onClick={handleUsersClick}
                />
              </div>
            </div>
          </div>
        ) : (
          // Regular Mode Content
          <>
            <div className={styles.sidebar__sections}>
              {/* Context Section */}
              <div className={styles.sidebar__section}>
                <h3 className={styles.sidebar__sectionTitle}>CONTEXT</h3>
                <div className={styles.sidebar__sectionContent}>
                  {contextItems.map((item) => (
                    <ListItem
                      key={item.id}
                      text={item.name}
                      icon="/document.svg"
                      selected={item.id === selectedItemId}
                      onClick={() => handleContextItemClick(item)}
                    />
                  ))}
                  {isAddingNew ? (
                    <InlineInput
                      placeholder="Enter page name..."
                      onSubmit={onCreateNew}
                      onCancel={onCancelNew}
                    />
                  ) : (
                    <ListItem
                      text="Add New"
                      icon="/plus.svg"
                      selected={false}
                      onClick={handleAddNewClick}
                    />
                  )}
                </div>
              </div>

              {/* Workspace Section */}
              <div className={styles.sidebar__section}>
                <h3 className={styles.sidebar__sectionTitle}>WORKSPACE</h3>
                <div className={styles.sidebar__sectionContent}>
                  <ListItem
                    text="Settings"
                    icon="/settings.svg"
                    selected={false}
                    onClick={handleSettingsClick}
                  />
                  <ListItem
                    text="Invite Members"
                    icon="/invite.svg"
                    selected={false}
                    onClick={handleInviteMembersClick}
                  />
                </div>
              </div>
            </div>

            {/* Admin Section - Conditional */}
            {isAdmin && (
              <div className={styles.sidebar__adminSection}>
                <h3 className={styles.sidebar__sectionTitle}>ADMIN</h3>
                <div className={styles.sidebar__sectionContent}>
                  <ListItem
                    text="Ckye Admin"
                    icon="/person.svg"
                    selected={false}
                    onClick={handleAdminClick}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;