
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import UserTable from '@/components/UserTable';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

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
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        // First get all user IDs and their roles
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('user_id, role');

        if (roleError) throw roleError;

        // Then get profile details
        const userData = [];
        for (const role of roleData || []) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .eq('id', role.user_id)
            .single();
          
          // Instead of using RPC, directly query the user email
          const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(role.user_id);
          const email = authUser?.user?.email || 'Email not available';
          
          userData.push({
            user_id: role.user_id,
            email: email,
            role: role.role as "admin" | "user",
            profiles: profileData ? {
              first_name: profileData.first_name,
              last_name: profileData.last_name
            } : null
          });
        }
        
        return userData;
      } catch (error: any) {
        console.error('Error fetching users:', error);
        throw error;
      }
    }
  });

  const handleRoleChange = async (userId: string, newRole: "admin" | "user") => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Role Updated",
        description: `User role successfully changed to ${newRole}`,
      });
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    }
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/admin/dashboard/users/${userId}`);
  };

  const filteredUsers = users?.filter(user => {
    const fullName = `${user.profiles?.first_name || ''} ${user.profiles?.last_name || ''}`.toLowerCase();
    const email = user.email.toLowerCase();
    const term = searchTerm.toLowerCase();
    
    return fullName.includes(term) || email.includes(term);
  });

  const formatUsersForTable = (users: UserData[]) => {
    return users.map(user => ({
      id: user.user_id,
      email: user.email,
      role: user.role,
      fullName: user.profiles ? `${user.profiles.first_name || ''} ${user.profiles.last_name || ''}`.trim() : 'N/A'
    }));
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center p-4">
          <p className="text-destructive font-semibold">Error loading users</p>
          <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
        </div>
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

      <div className="flex items-center relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search by name or email..." 
          className="pl-10" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
                users={filteredUsers ? formatUsersForTable(filteredUsers) : []} 
                loading={isLoading} 
                onRoleChange={handleRoleChange}
                onViewProfile={handleViewProfile}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="admins">
          <Card>
            <CardContent className="p-6">
              <UserTable 
                users={filteredUsers ? formatUsersForTable(filteredUsers.filter(user => user.role === 'admin')) : []} 
                loading={isLoading}
                onRoleChange={handleRoleChange}
                onViewProfile={handleViewProfile}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UsersManagement;
