
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface UserData {
  user_id: string;
  email: string;
  role: "admin" | "user" | null;
  first_name: string | null;
  last_name: string | null;
  banned?: boolean;
}

export function useUsersData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users data
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
      toast({
        title: "User Status Updated",
        description: "User status has been successfully updated."
      });
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

  return {
    users,
    isLoading,
    error,
    deleteUser,
    toggleBanUser
  };
}
