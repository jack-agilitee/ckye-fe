'use client';

import { useState, useEffect } from 'react';
import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';
import WorkspacesTable from '@/components/templates/WorkspacesTable/WorkspacesTable';
import AddWorkspaceModal from '@/components/organisms/AddWorkspaceModal/AddWorkspaceModal';
import { createWorkspace } from '@/lib/api/workspaces';
import styles from './page.module.scss';

export default function WorkspacesPageClient({ initialWorkspaces, initialUsers }) {
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [users] = useState(initialUsers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
      <div className={styles['workspaces-page']}>
        <SearchHeader 
          title="Workspaces"
          searchPlaceholder="Search Workspaces"
          buttonText="Add Workspace"
          onButtonClick={handleAddWorkspace}
          onSearchChange={handleSearchChange}
        />
        <WorkspacesTable workspaces={filteredWorkspaces} />
      </div>
      
      {isAddModalOpen && (
        <AddWorkspaceModal
          closeModal={() => setIsAddModalOpen(false)}
          users={users}
          createWorkspace={async (newWorkspace) => {
            try {
              const createdWorkspace = await createWorkspace({
                name: newWorkspace.name,
                description: `Workspace for ${newWorkspace.name}`,
                userIds: newWorkspace.selectedUsers?.map(user => user.id)
              });
              
              setWorkspaces([...workspaces, createdWorkspace]);
              setIsAddModalOpen(false);
              // Clear search when adding new workspace so it's visible
              setSearchQuery('');
            } catch (error) {
              console.error('Failed to create workspace:', error);
            }
          }}
        />
      )}
    </>
  );
}