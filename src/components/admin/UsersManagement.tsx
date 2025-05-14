
import React, { useState } from 'react';
import UserTable from '@/components/UserTable';
import UserSearchBar from './UserSearchBar';
import UserConfirmationDialogs from './UserConfirmationDialogs';
import UserPagination from './UserPagination';
import { useUsersData } from '@/hooks/useUsersData';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToBan, setUserToBan] = useState<{id: string, email: string, isBanned: boolean} | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Items per page
  
  const { 
    users, 
    isLoading, 
    deleteUser, 
    toggleBanUser,
    totalPages,
    isFetching
  } = useUsersData({
    page: currentPage,
    pageSize
  });

  // Filter users based on search term
  const filteredUsers = users?.filter(user => {
    if (!user) return false;
    
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    const email = (user.email || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    
    return fullName.includes(term) || email.includes(term);
  }) || [];

  // Handle user actions
  const handleDeleteUser = (userId: string) => setUserToDelete(userId);
  const handleConfirmDeleteUser = () => {
    if (userToDelete) deleteUser.mutate(userToDelete);
    setUserToDelete(null);
  };

  const handleToggleBan = (userId: string, email: string, isBanned: boolean) => {
    setUserToBan({ id: userId, email, isBanned });
  };
  
  const handleConfirmToggleBan = () => {
    if (userToBan) {
      toggleBanUser.mutate({ 
        userId: userToBan.id, 
        isBanned: userToBan.isBanned 
      });
      setUserToBan(null);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <UserSearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <UserTable 
        users={filteredUsers} 
        loading={isLoading || isFetching}
        onDeleteUser={handleDeleteUser}
        onToggleBan={handleToggleBan}
      />

      <UserPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading || isFetching}
      />

      <UserConfirmationDialogs
        userToDelete={userToDelete}
        userToBan={userToBan}
        onCloseDeleteDialog={() => setUserToDelete(null)}
        onCloseBanDialog={() => setUserToBan(null)}
        onConfirmDelete={handleConfirmDeleteUser}
        onConfirmBan={handleConfirmToggleBan}
      />
    </div>
  );
};

export default UsersManagement;
