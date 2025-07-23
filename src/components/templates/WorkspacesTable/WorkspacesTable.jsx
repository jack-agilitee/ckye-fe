'use client';

import ListItem from '../../molecules/ListItem/ListItem';
import styles from './WorkspacesTable.module.scss';

const WorkspacesTable = ({ workspaces = [] }) => {
  return (
    <div className={styles['workspaces-table']}>
      {/* Table Header */}
      <div className={styles['workspaces-table__header']}>
        <span className={styles['workspaces-table__header-text']}>Workspaces</span>
      </div>

      {/* Table Body */}
      <div className={styles['workspaces-table__body']}>
        {workspaces.map((workspace, index) => (
          <div key={workspace.id || index} className={styles['workspaces-table__row']}>
            <ListItem 
              text={workspace.name}
              icon="/document.svg"
              selected={false}
              className={styles['workspaces-table__item']}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkspacesTable;