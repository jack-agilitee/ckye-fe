'use client';

import { useState } from 'react';
import TextField from '@/components/atoms/TextField/TextField';
import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import Button from '@/components/atoms/Button/Button';
import styles from './AddUserModal.module.scss';

const AddUserModal = ({ closeModal, workspaces = [], addUsers }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState('');

  const handleInviteMembers = () => {
    if (addUsers) {
      addUsers({
        name,
        email, 
        selectedWorkspace
      })
    }
  };

  const handleWorkspaceChange = (e) => {
    setSelectedWorkspace(e.target.value);
  };

  // Transform workspaces array into dropdown options
  const workspaceOptions = workspaces.map(workspace => ({
    value: workspace.id || workspace.name,
    label: workspace.name
  }));

  return (
    <div className={styles['add-user-modal']}>
      <div className={styles['add-user-modal__container']}>
        <div className={styles['add-user-modal__content']}>
          <div className={styles['add-user-modal__header']}>
            <h2 className={styles['add-user-modal__title']}>Add User</h2>
          </div>
          
          <div className={styles['add-user-modal__divider']} />
          
          <div className={styles['add-user-modal__form']}>
            <div className={styles['add-user-modal__field']}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=""
              />
            </div>
            
            <div className={styles['add-user-modal__field']}>
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
              />
            </div>
            
            <div className={styles['add-user-modal__field']}>
              <Dropdown
                label="Workspace"
                value={selectedWorkspace}
                onChange={handleWorkspaceChange}
                options={workspaceOptions}
                placeholder="Select Workspace"
              />
            </div>
          </div>
          
          <div className={styles['add-user-modal__actions']}>
            <Button
              variant="primary"
              onClick={closeModal}
              className={styles['add-user-modal__button']}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleInviteMembers}
              className={styles['add-user-modal__button']}
            >
              Invite Members
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;