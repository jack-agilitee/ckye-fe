'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './WorkspacesTable.module.scss';

const WorkspacesTable = ({ workspaces = [] }) => {
  const router = useRouter();

  const handleRowClick = (workspace) => {
    router.push(`/admin/workspaces/${workspace.id}`);
  };

  return (
    <div className={styles['workspaces-table']}>
      {/* Table Body - No header */}
      <div className={styles['workspaces-table__body']}>
        {workspaces.map((workspace, index) => (
          <div 
            key={workspace.id || index} 
            className={styles['workspaces-table__row']}
            onClick={() => handleRowClick(workspace)}
          >
            <span className={styles['workspaces-table__name']}>
              {workspace.name}
            </span>
            <Image 
              src="/chevron-right.svg"
              alt="Navigate"
              width={16}
              height={16}
              className={styles['workspaces-table__chevron']}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkspacesTable;