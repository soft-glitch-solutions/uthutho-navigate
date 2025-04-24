
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import UserTable from '@/components/UserTable';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Search, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
}

interface UserData {
  user_id: string;
  email: string;
  role: "admin" | "user" | null;
  profiles: UserProfile | null;
  banned?: boolean;
}

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToBan, setUserToBan] = useState<{id: string, email: string, isBanned: boolean} | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        // Get all profiles first
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name');

        if (profilesError) throw profilesError;

        // Get role data
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('user_id, role');

        if (roleError) throw roleError;
        
        // Get banned users
        const { data: bannedData, error: bannedError } = await supabase
          .from('banned_users')
          .select('user_id');
          
        if (bannedError) throw bannedError;
        
        const bannedUserIds = (bannedData || []).map(item => item.user_id);

        // Map role data to profiles
        const userData: UserData[] = [];
        
        for (const profile of profilesData || []) {
          // Find the role for this user if it exists
          const roleInfo = roleData?.find(r => r.user_id === profile.id);
          
          // Get user email
          const { data: emailData } = await supabase.rpc(
            'get_user_email',
            { user_id: profile.id }
          );
          const email = emailData || 'Email not available';
          
          userData.push({
            user_id: profile.id,
            email: email,
            role: roleInfo ? roleInfo.role as "admin" | "user" : null,
            profiles: {
              first_name: profile.first_name,
              last_name: profile.last_name
            },
            banned: bannedUserIds.includes(profile.id)
          });
        }
        
        // Log the user data fetch for activity logging
        await supabase.from('activity_logs').insert([{
          action: 'fetch_users',
          details: { count: userData.length },
          entity_type: 'user',
          status: 'success'
        }]);
        
        return userData;
      } catch (error: any) {
        console.error('Error fetching users:', error);
        throw error;
      }
    }
  });

  // Mutation to assign a role to a user
  const assignRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: "admin" | "user" }) => {
      // Check if user already has a role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role: role })
          .eq('user_id', userId);
        
        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: role });
        
        if (error) throw error;
      }

      // Log the action
      await supabase.from('activity_logs').insert([{
        action: 'assign_role',
        details: { user_id: userId, role },
        entity_type: 'user',
        entity_id: userId,
        status: 'success'
      }]);

      return { userId, role };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Role Updated",
        description: `User role successfully changed to ${data.role}`,
      });
    },
    onError: (error: any) => {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    }
  });
  
  // Mutation to delete a user
  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      // Delete the user from auth.users using admin access
      const { error } = await supabase.rpc('delete_user', {
        user_id: userId
      });
      
      if (error) throw error;
      
      // Log the deletion action
      await supabase.from('activity_logs').insert([{
        action: 'delete_user',
        details: { user_id: userId },
        entity_type: 'user',
        entity_id: userId,
        status: 'success'
      }]);
      
      return userId;
    },
    onSuccess: (userId) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "User Deleted",
        description: "User has been permanently deleted from the system.",
      });
      setUserToDelete(null);
    },
    onError: (error: any) => {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user: " + error.message,
        variant: "destructive",
      });
      setUserToDelete(null);
    }
  });
  
  // Mutation to ban/unban a user
  const toggleBanUser = useMutation({
    mutationFn: async ({ userId, isBanned }: { userId: string, isBanned: boolean }) => {
      let result;
      
      if (isBanned) {
        // Unban - delete from banned_users table
        result = await supabase
          .from('banned_users')
          .delete()
          .eq('user_id', userId);
      } else {
        // Ban - add to banned_users table
        result = await supabase
          .from('banned_users')
          .insert([{ user_id: userId }]);
      }
      
      if (result.error) throw result.error;
      
      // Log the ban/unban action
      await supabase.from('activity_logs').insert([{
        action: isBanned ? 'unban_user' : 'ban_user',
        details: { user_id: userId },
        entity_type: 'user',
        entity_id: userId,
        status: 'success'
      }]);
      
      return { userId, isBanned: !isBanned };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: data.isBanned ? "User Banned" : "User Unbanned",
        description: data.isBanned 
          ? "User has been banned from the system." 
          : "User ban has been removed.",
      });
      setUserToBan(null);
    },
    onError: (error: any) => {
      console.error('Error updating user ban status:', error);
      toast({
        title: "Error",
        description: "Failed to update user ban status: " + error.message,
        variant: "destructive",
      });
      setUserToBan(null);
    }
  });

  const handleRoleChange = async (userId: string, role: "admin" | "user") => {
    assignRole.mutate({ userId, role });
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/admin/dashboard/users/${userId}`);
  };
  
  const confirmDeleteUser = (userId: string) => {
    setUserToDelete(userId);
  };
  
  const handleDeleteUser = () => {
    if (userToDelete) {
      deleteUser.mutate(userToDelete);
    }
  };
  
  const confirmToggleBan = (userId: string, email: string, isBanned: boolean) => {
    setUserToBan({ id: userId, email, isBanned });
  };
  
  const handleToggleBan = () => {
    if (userToBan) {
      toggleBanUser.mutate({ 
        userId: userToBan.id, 
        isBanned: userToBan.isBanned 
      });
    }
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
      role: user.role || 'unassigned',
      fullName: user.profiles ? `${user.profiles.first_name || ''} ${user.profiles.last_name || ''}`.trim() : 'N/A',
      banned: user.banned || false
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
          <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
          <TabsTrigger value="banned">Banned</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-users">
          <Card>
            <CardContent className="p-6">
              <UserTable 
                users={filteredUsers ? formatUsersForTable(filteredUsers) : []} 
                loading={isLoading} 
                onRoleChange={handleRoleChange}
                onViewProfile={handleViewProfile}
                onDeleteUser={confirmDeleteUser}
                onToggleBan={confirmToggleBan}
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
                onDeleteUser={confirmDeleteUser}
                onToggleBan={confirmToggleBan}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unassigned">
          <Card>
            <CardContent className="p-6">
              <UserTable 
                users={filteredUsers ? formatUsersForTable(filteredUsers.filter(user => user.role === null)) : []} 
                loading={isLoading}
                onRoleChange={handleRoleChange}
                onViewProfile={handleViewProfile}
                onDeleteUser={confirmDeleteUser}
                onToggleBan={confirmToggleBan}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="banned">
          <Card>
            <CardContent className="p-6">
              <UserTable 
                users={filteredUsers ? formatUsersForTable(filteredUsers.filter(user => user.banned)) : []} 
                loading={isLoading}
                onRoleChange={handleRoleChange}
                onViewProfile={handleViewProfile}
                onDeleteUser={confirmDeleteUser}
                onToggleBan={confirmToggleBan}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm User Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Ban User Confirmation Dialog */}
      <AlertDialog open={!!userToBan} onOpenChange={(open) => !open && setUserToBan(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {userToBan?.isBanned ? 'Confirm Unban User' : 'Confirm Ban User'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {userToBan?.isBanned 
                ? `Are you sure you want to unban ${userToBan?.email}?` 
                : `Are you sure you want to ban ${userToBan?.email}? This will prevent them from accessing the system.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleBan} 
              className={userToBan?.isBanned ? '' : 'bg-destructive'}
            >
              {userToBan?.isBanned ? 'Unban User' : 'Ban User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersManagement;
