
import React, { useState } from 'react';
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

interface UserData {
  user_id: string;
  email: string;
  role: "admin" | "user" | null;
  first_name: string | null;
  last_name: string | null;
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
        // Fetch user profiles with role and ban status
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id, 
            first_name, 
            last_name,
            user_roles(role),
            banned_users(user_id)
          `);

        if (profilesError) throw profilesError;

        if (!profilesData) return [];

        // Transform data to include email and other details
        const userData: UserData[] = await Promise.all(
          profilesData.map(async (profile) => {
            // Add null check for profile
            if (!profile || !profile.id) {
              console.error("Invalid profile data:", profile);
              return {
                user_id: "unknown",
                email: "Error: Invalid user data",
                role: null,
                first_name: null,
                last_name: null,
                banned: false
              };
            }

            // Safely get email with error handling
            let email = "Email not available";
            try {
              const { data: emailData } = await supabase.rpc(
                'get_user_email', 
                { user_id: profile.id }
              );
              
              if (emailData) email = emailData;
            } catch (emailError) {
              console.error(`Error fetching email for user ${profile.id}:`, emailError);
            }

            return {
              user_id: profile.id,
              email,
              role: profile.user_roles?.[0]?.role || null,
              first_name: profile.first_name,
              last_name: profile.last_name,
              banned: !!profile.banned_users?.length
            };
          })
        );

        return userData;
      } catch (error: any) {
        console.error('Error fetching users:', error);
        throw error;
      }
    }
  });

  // Delete user mutation
  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.rpc('delete_user', { user_id: userId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "User Deleted",
        description: "User has been successfully deleted."
      });
      setUserToDelete(null);
    },
    onError: (error: any) => {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user: " + error.message,
        variant: "destructive"
      });
    }
  });

  // Ban/Unban user mutation
  const toggleBanUser = useMutation({
    mutationFn: async ({ userId, isBanned }: { userId: string, isBanned: boolean }) => {
      if (isBanned) {
        // Unban user - remove from banned_users
        const { error } = await supabase
          .from('banned_users')
          .delete()
          .eq('user_id', userId);
        
        if (error) throw error;
      } else {
        // Ban user - add to banned_users
        const { error } = await supabase
          .from('banned_users')
          .insert({ user_id: userId });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      // Add null check for userToBan
      if (userToBan) {
        toast({
          title: userToBan.isBanned ? "User Unbanned" : "User Banned",
          description: userToBan.isBanned 
            ? "User has been successfully unbanned." 
            : "User has been banned from the system."
        });
      } else {
        toast({
          title: "User Status Updated",
          description: "User status has been successfully updated."
        });
      }
      
      setUserToBan(null);
    },
    onError: (error: any) => {
      console.error('Error updating user ban status:', error);
      toast({
        title: "Error",
        description: "Failed to update user ban status: " + error.message,
        variant: "destructive"
      });
    }
  });

  const filteredUsers = users?.filter(user => {
    if (!user) return false;
    
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    const email = (user.email || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    
    return fullName.includes(term) || email.includes(term);
  }) || [];

  // Handle user actions
  const handleDeleteUser = (userId: string) => setUserToDelete(userId);
  const handleConfirmDeleteUser = () => {
    if (userToDelete) deleteUser.mutate(userToDelete);
  };

  const handleToggleBan = (userId: string, email: string, isBanned: boolean) => {
    setUserToBan({ id: userId, email, isBanned });
  };
  const handleConfirmToggleBan = () => {
    if (userToBan) {
      toggleBanUser.mutate({ 
        userId: userToBan.id, 
        isBanned: userToBan.isBanned 
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search users..." 
          className="pl-10" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <UserTable 
        users={filteredUsers} 
        loading={isLoading}
        onDeleteUser={handleDeleteUser}
        onToggleBan={handleToggleBan}
      />

      {/* Delete User Confirmation Dialog */}
      <AlertDialog 
        open={!!userToDelete} 
        onOpenChange={() => setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this user?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDeleteUser} 
              className="bg-destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Ban User Confirmation Dialog */}
      <AlertDialog 
        open={!!userToBan} 
        onOpenChange={() => setUserToBan(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {userToBan?.isBanned ? 'Unban User' : 'Ban User'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {userToBan ? 
                (userToBan.isBanned 
                  ? `Are you sure you want to unban ${userToBan.email || 'this user'}?`
                  : `Are you sure you want to ban ${userToBan.email || 'this user'}?`) 
                : 'Are you sure you want to update this user?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmToggleBan}
              className={userToBan?.isBanned ? '' : 'bg-destructive'}
            >
              {userToBan?.isBanned ? 'Unban' : 'Ban'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersManagement;
