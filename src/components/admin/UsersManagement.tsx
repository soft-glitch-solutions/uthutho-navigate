
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import UserTable from '@/components/UserTable';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

interface UserProfile {
  first_name: string;
  last_name: string;
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
      // Get all users with their roles
      const { data: userData, error: userError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          auth_users (
            email
          ),
          profiles (
            first_name,
            last_name
          )
        `);

      if (userError) {
        throw userError;
      }

      if (userData) {
        const formattedUsers: UserData[] = userData.map((ur) => ({
          user_id: ur.user_id,
          email: ur.auth_users?.email || 'Email not available',
          role: ur.role as "admin" | "user",
          profiles: ur.profiles || null
        }));
        
        setUsers(formattedUsers);
      }
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
                users={users} 
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
                users={users.filter(user => user.role === 'admin')} 
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
