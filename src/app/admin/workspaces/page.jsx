'use client';

import { useState, useEffect } from 'react';
import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import Sidebar from '@/components/templates/Sidebar/Sidebar';
import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';
import WorkspacesTable from '@/components/templates/WorkspacesTable/WorkspacesTable';
import styles from './page.module.scss';

// TODO: Replace with actual API call when implemented
async function getWorkspacesData() {
  // Mock data for now - replace with actual API call
  return [
    {
      id: '1',
      name: 'Americal Eagle',
      users: [
        { id: '1', name: 'John Doe', email: 'john@example.com', avatar: null },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: null },
      ],
    },
    {
      id: '2',
      name: 'Dollar General',
      users: [
        { id: '3', name: 'Bob Wilson', email: 'bob@example.com', avatar: null },
      ],
    },
    {
      id: '3',
      name: 'Subway',
      users: [
        { id: '4', name: 'Alice Brown', email: 'alice@example.com', avatar: null },
        { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', avatar: null },
      ],
    },
    {
      id: '4',
      name: 'Agilitee Internal',
      users: [],
    },
    {
      id: '5',
      name: 'Control4',
      users: [
        { id: '6', name: 'Eve Martin', email: 'eve@example.com', avatar: null },
      ],
    },
    {
      id: '6',
      name: 'Subway',
      users: [],
    },
  ];
}

const WorkspacesPage = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const data = await getWorkspacesData();
        setWorkspaces(data);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  const handleAddWorkspace = () => {
    console.log('Add workspace clicked');
    // TODO: Implement add workspace functionality
  };
  
  return (
    <TwoColumnPage
      leftContent={<Sidebar isAdminMode={true} />}
      rightContent={
        <div className={styles['workspaces-page']}>
          <SearchHeader 
            title="Workspaces"
            searchPlaceholder="Search Workspaces"
            addButtonText="Add Workspace"
            onAdd={handleAddWorkspace}
          />
          {loading ? (
            <div className={styles['workspaces-page__loading']}>Loading workspaces...</div>
          ) : (
            <WorkspacesTable workspaces={workspaces} />
          )}
        </div>
      }
    />
  );
};

export default WorkspacesPage;