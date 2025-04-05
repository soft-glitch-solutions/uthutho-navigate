
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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RotateCw } from 'lucide-react';

interface UserProfile {
  first_name: string;
  last_name: string;
}

interface UserData {
  user_id: string;
  email: string;
  role: 'admin' | 'user';
  profiles: UserProfile;
}

export const UsersManagement = ({ onRoleChange }: { 
  onRoleChange: (userId: string, role: string) => void 
}) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [resetLoading, setResetLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users with roles and profiles
      const { data: userRolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          profiles:user_id(first_name, last_name)
        `);
      
      if (rolesError) throw rolesError;
      
      // Also fetch user emails from auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      // Combine the data
      const combinedData = userRolesData.map(ur => {
        const authUser = authData.users.find(u => u.id === ur.user_id);
        
        // Handle possible errors in the profiles relation by providing defaults
        const profileData = ur.profiles as unknown;
        const profile: UserProfile = 
          profileData && typeof profileData === 'object' && !('error' in profileData)
            ? profileData as UserProfile
            : { first_name: '', last_name: '' };
            
        return {
          user_id: ur.user_id,
          email: authUser?.email || 'Unknown',
          role: ur.role,
          profiles: profile
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

  const handlePasswordReset = async (email: string, userId: string) => {
    try {
      setResetLoading(userId);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/password-reset`
      });

      if (error) throw error;

      toast({
        title: 'Password Reset Email Sent',
        description: `An email with reset instructions was sent to ${email}`,
      });
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send reset email',
        variant: 'destructive',
      });
    } finally {
      setResetLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Management</h2>
      
      {loading ? (
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
              {Array(5).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-6 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-[180px]" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                <TableHead>Password</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No users found</TableCell>
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
                    <TableCell>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handlePasswordReset(user.email, user.user_id)}
                        disabled={resetLoading === user.user_id}
                      >
                        {resetLoading === user.user_id ? (
                          <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : null}
                        Reset Password
                      </Button>
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
