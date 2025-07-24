'use client';

import { useState } from 'react';
import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';
import UsersTable from '@/components/templates/UsersTable/UsersTable';
import AddUserModal from '@/components/organisms/AddUserModal/AddUserModal';
import { createUser } from '@/lib/api/users';
import styles from './UsersPageClient.module.scss';

export default function UsersPageClient({ initialUsers, workspaces }) {
  const [users, setUsers] = useState(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [searchValue, setSearchValue] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

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

  const handleAddUser = async (userData) => {
    try {
      // Call API to create user
      const newUser = await createUser({
        name: userData.name,
        email: userData.email,
        userType: 'Member', // Default to Member
        workspaces: [userData.selectedWorkspace] // Add selected workspace
      });
      
      // Add the new user to the list
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      
      // Update filtered users if no search is active
      if (!searchValue) {
        setFilteredUsers(updatedUsers);
      }
      
      // Close the modal
      setShowAddUserModal(false);
      
      // Optionally show success message
      console.log('User created successfully:', newUser);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
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