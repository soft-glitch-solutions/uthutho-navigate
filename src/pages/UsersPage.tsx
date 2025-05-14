
import React from 'react';
import UsersManagement from '@/components/admin/UsersManagement';

const UsersPage = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">User Management</h1>
      <p className="text-muted-foreground">Manage system users, roles and permissions.</p>
      <UsersManagement />
    </div>
  );
};

export default UsersPage;
