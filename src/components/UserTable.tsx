
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LockKeyhole, ShieldAlert, MailCheck } from 'lucide-react';

interface UserTableProps {
  users: Array<{ id: string; email: string; role: string; fullName?: string }>;
  loading?: boolean;
  onRoleChange: (userId: string, role: string) => void;
}

const UserTable = ({ users, loading = false, onRoleChange }: UserTableProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (users.length === 0) {
    return <div className="text-center py-6">No users found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-foreground">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4">Email</th>
            <th className="text-left py-3 px-4">Name</th>
            <th className="text-left py-3 px-4">Role</th>
            <th className="text-left py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-border hover:bg-muted/50">
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">{user.fullName || 'N/A'}</td>
              <td className="py-3 px-4">
                <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                  {user.role === 'admin' ? (
                    <ShieldAlert className="h-3 w-3 mr-1" />
                  ) : (
                    <></>
                  )}
                  {user.role}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  <select
                    value={user.role}
                    onChange={(e) => onRoleChange(user.id, e.target.value)}
                    className="bg-background text-foreground p-2 rounded border border-border"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <LockKeyhole className="h-4 w-4 mr-1" />
                    Reset Password
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <MailCheck className="h-4 w-4 mr-1" />
                    Send Email
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
