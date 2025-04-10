
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import UserTable from '@/components/UserTable';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
}

interface UserData {
  user_id: string;
  email: string;
  role: "admin" | "user";
  profiles: UserProfile | null;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // First get all user IDs and their roles
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (roleError) throw roleError;

      // Then get user emails from auth.users via a custom RPC function since we can't query auth directly
      const userData = [];
      for (const role of roleData || []) {
        const { data: authUser } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .eq('id', role.user_id)
          .single();
          
        const { data: userEmail } = await supabase
          .rpc('get_user_email', { user_id: role.user_id });
        
        userData.push({
          user_id: role.user_id,
          email: userEmail || 'Email not available',
          role: role.role as "admin" | "user",
          profiles: authUser ? {
            first_name: authUser.first_name,
            last_name: authUser.last_name
          } : null
        });
      }
      
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: "admin" | "user") => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.user_id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Role Updated",
        description: `User role successfully changed to ${newRole}`,
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    }
  };

  const formatUsersForTable = (users: UserData[]) => {
    return users.map(user => ({
      id: user.user_id,
      email: user.email,
      role: user.role,
      fullName: user.profiles ? `${user.profiles.first_name || ''} ${user.profiles.last_name || ''}`.trim() : 'N/A'
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">
          Manage users and their roles in the system
        </p>
      </div>

      <Tabs defaultValue="all-users" className="w-full">
        <TabsList>
          <TabsTrigger value="all-users">All Users</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-users">
          <Card>
            <CardContent className="p-6">
              <UserTable 
                users={formatUsersForTable(users)} 
                loading={loading} 
                onRoleChange={handleRoleChange} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="admins">
          <Card>
            <CardContent className="p-6">
              <UserTable 
                users={formatUsersForTable(users.filter(user => user.role === 'admin'))} 
                loading={loading}
                onRoleChange={handleRoleChange} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UsersManagement;
