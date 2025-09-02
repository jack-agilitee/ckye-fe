'use client';

import { useState, useEffect, useRef } from 'react';
import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';
import UsersTable from '@/components/templates/UsersTable/UsersTable';
import AddUserModal from '@/components/organisms/AddUserModal/AddUserModal';
import EditUserModal from '@/components/organisms/EditUserModal/EditUserModal';
import FilterModal from '@/components/organisms/FilterModal/FilterModal';
import { createUser, getUsers } from '@/lib/api/users';
import styles from './UsersPageClient.module.scss';

export default function UsersPageClient({ initialUsers, workspaces }) {
  const [users, setUsers] = useState(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [searchValue, setSearchValue] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [filterPosition, setFilterPosition] = useState({ top: 0, left: 0 });
  const filterButtonRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // Define filter configuration
  const filterConfig = {
    userType: {
      label: 'User Type',
      type: 'checkbox',
      options: [
        { value: 'Viewer', label: 'Viewer' },
        { value: 'Member', label: 'Member' },
        { value: 'WorkspaceAdmin', label: 'Workspace Admin' },
        { value: 'Admin', label: 'Ckye Admin' }
      ]
    },
    accountType: {
      label: 'Account Type',
      type: 'checkbox',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Deactivated', label: 'Deactivated' }
      ]
    }
  };

  // Fetch users with filters
  useEffect(() => {
    const fetchFilteredUsers = async () => {
      setIsLoading(true);
      try {
        const filters = {
          search: searchValue,
          userTypes: filterValues.userType || [],
          accountTypes: filterValues.accountType || []
        };
        
        const response = await getUsers(filters);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Error fetching filtered users:', error);
        // Fallback to client-side filtering
        let filtered = users;
        
        if (searchValue.trim()) {
          filtered = filtered.filter(user => 
            user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.email.toLowerCase().includes(searchValue.toLowerCase())
          );
        }
        
        if (filterValues.userType && filterValues.userType.length > 0) {
          filtered = filtered.filter(user => 
            filterValues.userType.includes(user.userType)
          );
        }
        
        setFilteredUsers(filtered);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredUsers();
  }, [searchValue, filterValues, users]);

  // Handle search functionality
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const handleFilterClick = () => {
    console.log('Filter button clicked, current state:', showFilterModal);
    if (filterButtonRef.current) {
      const rect = filterButtonRef.current.getBoundingClientRect();
      console.log('Button position:', rect);
      
      // Calculate position with viewport boundary checks
      const modalWidth = 350; // max-width from CSS
      const viewportWidth = window.innerWidth;
      
      let left = rect.left;
      // If modal would go off right edge, align it to the right of the button
      if (left + modalWidth > viewportWidth) {
        left = rect.right - modalWidth;
      }
      
      setFilterPosition({
        top: rect.bottom + 8,
        left: Math.max(10, left) // Ensure at least 10px from left edge
      });
    }
    setShowFilterModal(!showFilterModal);
  };

  const handleFilterChange = (newValues) => {
    setFilterValues(newValues);
  };

  const handleFilterClose = () => {
    setShowFilterModal(false);
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

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditUserModal(false);
    setSelectedUser(null);
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
        showFilter={true}
        onFilterClick={handleFilterClick}
        filterButtonRef={filterButtonRef}
      />
      
      {showFilterModal && (
        <FilterModal
          filters={filterConfig}
          values={filterValues}
          onChange={handleFilterChange}
          onClose={handleFilterClose}
          position={filterPosition}
        />
      )}
      
      <UsersTable 
        users={filteredUsers} 
        onUserClick={handleUserClick}
      />
      
      {showAddUserModal && (
        <AddUserModal
          closeModal={handleCloseModal}
          workspaces={workspaces}
          addUsers={handleAddUser}
        />
      )}
      
      <EditUserModal
        user={selectedUser}
        isOpen={showEditUserModal}
        onClose={handleCloseEditModal}
      />
    </div>
  );
}