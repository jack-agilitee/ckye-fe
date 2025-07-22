'use client';

import User from '../../molecules/User/User';
import SeatType from '../../molecules/SeatType/SeatType';
import styles from './UsersTable.module.scss';

const UsersTable = ({ users = [] }) => {
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
        <div className={styles['users-table__column']}>
          <span className={styles['users-table__header-text']}>Workspaces</span>
        </div>
      </div>

      {/* Table Body */}
      <div className={styles['users-table__body']}>
        {users.map((user, index) => (
          <div key={index} className={styles['users-table__row']}>
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
            <div className={styles['users-table__column']}>
              <span className={styles['users-table__workspaces']}>
                {formatWorkspaces(user.workspaces)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersTable;