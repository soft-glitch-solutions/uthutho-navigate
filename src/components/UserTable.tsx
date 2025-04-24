
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, LockKeyhole, Trash2, Ban, UnbanIcon } from 'lucide-react';

interface UserTableProps {
  users: Array<{ 
    user_id: string; 
    email: string; 
    role?: "admin" | "user" | null;
    first_name?: string;
    last_name?: string;
    banned?: boolean;
  }>;
  loading?: boolean;
  onDeleteUser?: (userId: string) => void;
  onToggleBan?: (userId: string, email: string, isBanned: boolean) => void;
}

const UserTable = ({ 
  users, 
  loading = false, 
  onDeleteUser = () => {},
  onToggleBan = () => {}
}: UserTableProps) => {
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
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-left py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id} className="border-b border-border hover:bg-muted/50">
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">
                {user.first_name || user.last_name 
                  ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                  : 'N/A'}
              </td>
              <td className="py-3 px-4">
                <Badge 
                  variant={user.role === 'admin' ? 'destructive' : 'secondary'}
                >
                  {user.role || 'Unassigned'}
                </Badge>
              </td>
              <td className="py-3 px-4">
                {user.banned ? (
                  <Badge variant="destructive">Banned</Badge>
                ) : (
                  <Badge variant="outline" className="text-green-500">Active</Badge>
                )}
              </td>
              <td className="py-3 px-4 space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onToggleBan(
                    user.user_id, 
                    user.email, 
                    !!user.banned
                  )}
                  className={user.banned 
                    ? "text-green-500 hover:text-green-600" 
                    : "text-yellow-500 hover:text-yellow-600"
                  }
                >
                  {user.banned ? (
                    <>
                      <UnbanIcon className="h-4 w-4 mr-1" />
                      Unban
                    </>
                  ) : (
                    <>
                      <Ban className="h-4 w-4 mr-1" />
                      Ban
                    </>
                  )}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => onDeleteUser(user.user_id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
