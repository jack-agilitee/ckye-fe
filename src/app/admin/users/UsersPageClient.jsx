'use client';

import { useState } from 'react';
import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';
import UsersTable from '@/components/templates/UsersTable/UsersTable';

export default function UsersPageClient({ initialUsers }) {
  const [users] = useState(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [searchValue, setSearchValue] = useState('');

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

  const handleAddUsers = () => {
    console.log('TODO: Open Add User Modal');
    // TODO: Implement add user modal functionality
  };

  return (
    <>
      <SearchHeader
        title="Users"
        searchPlaceholder="Search Users"
        buttonText="Add Users"
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onButtonClick={handleAddUsers}
      />
      <UsersTable users={filteredUsers} />
    </>
  );
}