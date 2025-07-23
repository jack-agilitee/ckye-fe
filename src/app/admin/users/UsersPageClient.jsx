'use client';

import { useState } from 'react';
import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';
import UsersTable from '@/components/templates/UsersTable/UsersTable';
import AddUserModal from '@/components/organisms/AddUserModal/AddUserModal';
import styles from './UsersPageClient.module.scss';

export default function UsersPageClient({ initialUsers }) {
  const [users] = useState(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [searchValue, setSearchValue] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Extract unique workspaces from users
  const workspaces = [...new Set(users.flatMap(user => user.workspaces))].map(name => ({
    id: name,
    name: name
  }));

  // Handle search functionality
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    
    if (value.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleCloseModal = () => {
    setShowAddUserModal(false);
  };

  const handleAddUser = (userData) => {
    // TODO: Call API to create user
    console.log('Adding user:', userData);
    // For now, just close the modal
    setShowAddUserModal(false);
  };

  return (
    <div className={styles['users-page']}>
      <SearchHeader
        title="Users"
        searchPlaceholder="Search Users"
        buttonText="Add Users"
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onButtonClick={() => setShowAddUserModal(true)}
      />
      <UsersTable users={filteredUsers} />
      
      {showAddUserModal && (
        <AddUserModal
          closeModal={handleCloseModal}
          workspaces={workspaces}
          addUsers={handleAddUser}
        />
      )}
    </div>
  );
}