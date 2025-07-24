'use client';

import { useRouter } from 'next/navigation';
import ListItem from '../../molecules/ListItem/ListItem';
import styles from './WorkspacesTable.module.scss';

const WorkspacesTable = ({ workspaces = [] }) => {
  const router = useRouter();

  const handleRowClick = (workspace) => {
    if (workspace.shortName) {
      router.push(`/dashboard/${workspace.shortName}`);
    }
  };

  return (
    <div className={styles['workspaces-table']}>
      {/* Table Header */}
      <div className={styles['workspaces-table__header']}>
        <span className={styles['workspaces-table__header-text']}>Workspaces</span>
      </div>

      {/* Table Body */}
      <div className={styles['workspaces-table__body']}>
        {workspaces.map((workspace, index) => (
          <div 
            key={workspace.id || index} 
            className={styles['workspaces-table__row']}
            onClick={() => handleRowClick(workspace)}
            style={{ cursor: 'pointer' }}
          >
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