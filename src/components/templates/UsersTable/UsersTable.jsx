'use client';

import Image from 'next/image';
import User from '../../molecules/User/User';
import SeatType from '../../molecules/SeatType/SeatType';
import styles from './UsersTable.module.scss';

const UsersTable = ({ users = [], showWorkspaces = true, onUserClick }) => {
  // Format workspaces for display
  const formatWorkspaces = (workspaces) => {
    if (!workspaces || workspaces.length === 0) return '';
    return workspaces.join(', ');
  };

  return (
    <div className={styles['users-table']}>
      {/* Table Header */}
      <div className={styles['users-table__header']}>
        <div className={styles['users-table__column']}>
          <span className={styles['users-table__header-text']}>Name</span>
        </div>
        <div className={styles['users-table__column']}>
          <span className={styles['users-table__header-text']}>User Type</span>
        </div>
        {showWorkspaces && (
          <div className={styles['users-table__column']}>
            <span className={styles['users-table__header-text']}>Workspaces</span>
          </div>
        )}
      </div>

      {/* Table Body */}
      <div className={styles['users-table__body']}>
        {users.map((user, index) => (
          <div 
            key={index} 
            className={`${styles['users-table__row']} ${onUserClick ? styles['users-table__row--clickable'] : ''}`}
            onClick={() => onUserClick && onUserClick(user)}
          >
            <div className={styles['users-table__column']}>
              <User 
                name={user.name} 
                email={user.email}
                className={styles['users-table__user']}
              />
            </div>
            <div className={styles['users-table__column']}>
              <SeatType 
                type={user.userType}
                className={styles['users-table__seat-type']}
              />
            </div>
            {showWorkspaces && (
              <div className={styles['users-table__column']}>
                <span className={styles['users-table__workspaces']}>
                  {formatWorkspaces(user.workspaces)}
                </span>
              </div>
            )}
            {onUserClick && (
              <div className={styles['users-table__column-action']}>
                <Image
                  src="/chevron-right.svg"
                  alt="Edit user"
                  width={16}
                  height={16}
                  className={styles['users-table__chevron']}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersTable;