
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface User {
  id: string;
  email: string;
  role: string;
}

interface UsersPageProps {
  users?: User[];
  onRoleChange?: (userId: string, role: string) => void;
}

const UsersPage: React.FC<UsersPageProps> = ({ users: propUsers, onRoleChange }) => {
  const [users, setUsers] = useState<User[]>(propUsers || []);
  const [loading, setLoading] = useState(!propUsers);

  useEffect(() => {
    if (!propUsers) {
      fetchUsers();
    }
  }, [propUsers]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users with roles
      const { data: userRolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) throw rolesError;
      
      // Also fetch user emails from auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      // Combine the data
      const combinedData = userRolesData.map(ur => {
        const authUser = authData.users.find(u => u.id === ur.user_id);
        return {
          id: ur.user_id,
          email: authUser?.email || 'Unknown',
          role: ur.role
        };
      });
      
      setUsers(combinedData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId: string, role: string) => {
    // Update local state
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role } : user
    ));
    
    // Call parent handler if provided
    if (onRoleChange) {
      onRoleChange(userId, role);
    }
  };

  return (
    <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">User Management</h2>
      <div className="overflow-x-auto">
        {loading ? (
          <table className="w-full text-foreground">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array(5).fill(0).map((_, index) => (
                <tr key={index} className="border-b border-border">
                  <td className="py-3 px-4"><Skeleton className="h-6 w-[200px]" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-6 w-[100px]" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-10 w-[180px]" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-foreground">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border">
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.role}</td>
                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="bg-background text-foreground p-2 rounded"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
