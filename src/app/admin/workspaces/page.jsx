'use client';

import { useState, useEffect } from 'react';
import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import Sidebar from '@/components/templates/Sidebar/Sidebar';
import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';
import WorkspacesTable from '@/components/templates/WorkspacesTable/WorkspacesTable';
import AddWorkspaceModal from '@/components/organisms/AddWorkspaceModal/AddWorkspaceModal';
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

// TODO: Replace with actual API call when implemented
async function getUsersData() {
  // Mock users data for the AddWorkspaceModal
  return [
    { id: '1', name: 'John Doe', email: 'john@example.com', avatar: null },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: null },
    { id: '3', name: 'Bob Wilson', email: 'bob@example.com', avatar: null },
    { id: '4', name: 'Alice Brown', email: 'alice@example.com', avatar: null },
    { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', avatar: null },
    { id: '6', name: 'Eve Martin', email: 'eve@example.com', avatar: null },
    { id: '7', name: 'Frank Thompson', email: 'frank@example.com', avatar: null },
    { id: '8', name: 'Grace Lee', email: 'grace@example.com', avatar: null },
    { id: '9', name: 'Henry Williams', email: 'henry@example.com', avatar: null },
    { id: '10', name: 'Iris Johnson', email: 'iris@example.com', avatar: null },
  ];
}

const WorkspacesPage = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both workspaces and users in parallel
        const [workspacesData, usersData] = await Promise.all([
          getWorkspacesData(),
          getUsersData()
        ]);
        setWorkspaces(workspacesData);
        setUsers(usersData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddWorkspace = () => {
    setIsAddModalOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  };

  // Filter workspaces based on search query
  const filteredWorkspaces = workspaces.filter(workspace => 
    workspace.name.toLowerCase().includes((searchQuery || '').toLowerCase())
  );
  
  return (
    <>
      <TwoColumnPage
        leftContent={<Sidebar isAdminMode={true} />}
        rightContent={
          <div className={styles['workspaces-page']}>
            <SearchHeader 
              title="Workspaces"
              searchPlaceholder="Search Workspaces"
              buttonText="Add Workspace"
              onButtonClick={handleAddWorkspace}
              onSearchChange={handleSearchChange}
            />
            {loading ? (
              <div className={styles['workspaces-page__loading']}>Loading workspaces...</div>
            ) : (
              <WorkspacesTable workspaces={filteredWorkspaces} />
            )}
          </div>
        }
      />
      {isAddModalOpen && (
        <AddWorkspaceModal
          closeModal={() => setIsAddModalOpen(false)}
          users={users}
          createWorkspace={(newWorkspace) => {
            // Create a new workspace object with generated ID
            const workspace = {
              id: String(workspaces.length + 1),
              name: newWorkspace.name,
              users: users.filter(user => newWorkspace.selectedUsers.includes(user.id))
            };
            // Add the new workspace to the list
            setWorkspaces([...workspaces, workspace]);
            setIsAddModalOpen(false);
            // Clear search when adding new workspace so it's visible
            setSearchQuery('');
          }}
        />
      )}
    </>
  );
};

export default WorkspacesPage;