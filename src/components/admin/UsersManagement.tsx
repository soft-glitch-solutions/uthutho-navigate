
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface UserData {
  user_id: string;
  email: string;
  role: 'admin' | 'user';
  profiles: {
    first_name: string | null;
    last_name: string | null;
  };
}

export const UsersManagement = ({ onRoleChange }: { 
  onRoleChange: (userId: string, role: string) => void 
}) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users with roles and profiles
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          profiles:user_id(first_name, last_name)
        `)
        .order('role', { ascending: false });
      
      if (error) throw error;
      
      // Also fetch user emails from auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      // Combine the data
      const combinedData = data.map(ur => {
        const authUser = authData.users.find(u => u.id === ur.user_id);
        // Handle possible SelectQueryError for profiles
        const profileData = typeof ur.profiles === 'object' && !('error' in ur.profiles) 
          ? ur.profiles 
          : { first_name: null, last_name: null };
          
        return {
          user_id: ur.user_id,
          email: authUser?.email || 'Unknown',
          role: ur.role,
          profiles: profileData
        };
      });
      
      setUsers(combinedData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.user_id === userId ? { ...user, role: newRole } : user
      ));
      
      // Notify parent component
      onRoleChange(userId, newRole);
      
      toast({
        title: 'Role Updated',
        description: `User role changed to ${newRole}`,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Management</h2>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No users found</TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.profiles.first_name} {user.profiles.last_name}
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value: 'admin' | 'user') => handleRoleChange(user.user_id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
