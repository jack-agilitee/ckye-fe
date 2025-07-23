'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AccountChanger from '@/components/organisms/AccountChanger/AccountChanger';
import styles from './Sidebar.module.scss';

const Sidebar = ({ 
  contextItems = [],
  selectedItemId = null,
  isAdmin = false,
  accountName = 'AEO',
  accountInitial = 'A',
  onContextItemClick,
  onAddNewClick,
  onWorkspaceItemClick,
  onAccountClick,
  onNotesClick
}) => {
  const router = useRouter();

  const handleContextItemClick = (item) => {
    console.log(item.name);
    if (onContextItemClick) {
      onContextItemClick(item);
    }
  };

  const handleAddNewClick = () => {
    console.log('add new');
    if (onAddNewClick) {
      onAddNewClick();
    }
  };

  const handleWorkspaceItemClick = (itemName) => {
    console.log(itemName);
    if (onWorkspaceItemClick) {
      onWorkspaceItemClick(itemName);
    }
  };

  const handleAdminClick = () => {
    console.log('Ckye Admin');
    // TODO: Replace with proper routing
    router.push('/admin/workspace');
  };

  const workspaceItems = [
    { name: 'Settings', icon: '/settings.svg' },
    { name: 'Invite Members', icon: '/invite.svg' }
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar__header}>
        <AccountChanger
          accountName={accountName}
          accountInitial={accountInitial}
          onAccountClick={onAccountClick}
          onNotesClick={onNotesClick}
          isAdmin={false}
        />
      </div>

      <div className={styles.sidebar__content}>
        <div className={styles.sidebar__sections}>
          {/* Context Section */}
          <div className={styles.sidebar__section}>
            <h3 className={styles.sidebar__sectionTitle}>CONTEXT</h3>
            <div className={styles.sidebar__sectionContent}>
              {contextItems.map((item) => (
                <button
                  key={item.id}
                  className={`${styles.sidebar__listItem} ${
                    item.id === selectedItemId ? styles['sidebar__listItem--selected'] : ''
                  }`}
                  onClick={() => handleContextItemClick(item)}
                >
                  <Image 
                    src="/document.svg"
                    alt=""
                    width={16}
                    height={16}
                    className={styles.sidebar__listItemIcon}
                  />
                  <span className={styles.sidebar__listItemText}>
                    {item.name}
                  </span>
                </button>
              ))}
              <button
                className={styles.sidebar__listItem}
                onClick={handleAddNewClick}
              >
                <Image 
                  src="/plus.svg"
                  alt=""
                  width={16}
                  height={16}
                  className={styles.sidebar__listItemIcon}
                />
                <span className={styles.sidebar__listItemText}>
                  Add New
                </span>
              </button>
            </div>
          </div>

          {/* Workspace Section */}
          <div className={styles.sidebar__section}>
            <h3 className={styles.sidebar__sectionTitle}>WORKSPACE</h3>
            <div className={styles.sidebar__sectionContent}>
              {workspaceItems.map((item) => (
                <button
                  key={item.name}
                  className={styles.sidebar__listItem}
                  onClick={() => handleWorkspaceItemClick(item.name)}
                >
                  <Image 
                    src={item.icon}
                    alt=""
                    width={16}
                    height={16}
                    className={styles.sidebar__listItemIcon}
                  />
                  <span className={styles.sidebar__listItemText}>
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Section - Conditional */}
        {isAdmin && (
          <div className={styles.sidebar__adminSection}>
            <h3 className={styles.sidebar__sectionTitle}>ADMIN</h3>
            <div className={styles.sidebar__sectionContent}>
              <button
                className={styles.sidebar__listItem}
                onClick={handleAdminClick}
              >
                <Image 
                  src="/person.svg"
                  alt=""
                  width={16}
                  height={16}
                  className={styles.sidebar__listItemIcon}
                />
                <span className={styles.sidebar__listItemText}>
                  Ckye Admin
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;