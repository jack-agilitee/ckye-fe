'use client';

import { useState } from 'react';
import TextField from '@/components/atoms/TextField/TextField';
import Button from '@/components/atoms/Button/Button';
import WorkspaceSelector from '@/components/molecules/WorkspaceSelector/WorkspaceSelector';
import styles from './AddWorkspaceModal.module.scss';

const AddWorkspaceModal = ({ 
  closeModal,
  users = [],
  className = '',
  createWorkspace
}) => {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleCreateWorkspace = () => {
    if (createWorkspace) {
      createWorkspace({
        name,
        shortName,
        selectedUsers
      })
    }
    // TODO: Hook up API call for workspace creation
  };

  return (
    <div className={`${styles['add-workspace-modal']} ${className}`}>
      <div className={styles['add-workspace-modal__container']}>
        <div className={styles['add-workspace-modal__content']}>
          <div className={styles['add-workspace-modal__header']}>
            <h2 className={styles['add-workspace-modal__title']}>Add Workspace</h2>
          </div>
          
          <div className={styles['add-workspace-modal__divider']} />
          
          <div className={styles['add-workspace-modal__form']}>
            <TextField 
              label="Name"
              placeholder=""
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles['add-workspace-modal__field']}
            />
            
            <TextField 
              label="Short Name (Used for URL Path)"
              placeholder=""
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              className={styles['add-workspace-modal__field']}
            />
            
            <WorkspaceSelector 
              label="Add Users"
              placeholder="Select users..."
              options={users}
              value={selectedUsers}
              onChange={setSelectedUsers}
              className={styles['add-workspace-modal__field']}
            />
          </div>
          
          <div className={styles['add-workspace-modal__actions']}>
            <Button 
              variant="secondary"
              onClick={closeModal}
              className={styles['add-workspace-modal__button']}
              icon={null}
            >
              Cancel
            </Button>
            
            <Button 
              variant="primary"
              onClick={handleCreateWorkspace}
              className={styles['add-workspace-modal__button']}
              icon={null}
            >
              Create Workspace
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWorkspaceModal;