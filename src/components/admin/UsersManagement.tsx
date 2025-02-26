
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface UserData {
  user_id: string;
  role: AppRole;
  profiles: {
    first_name: string | null;
    last_name: string | null;
  };
}

const UsersManagement = () => {
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          profiles!inner (
            first_name,
            last_name
          )
        `);
      
      if (error) throw error;

      const { data: { users: authUsers } } = await supabase.auth.admin.listUsers();
      
      return userRoles?.map((ur: UserData) => ({
        id: ur.user_id,
        email: authUsers.find(u => u.id === ur.user_id)?.email || '',
        firstName: ur.profiles.first_name,
        lastName: ur.profiles.last_name,
        role: ur.role,
      }));
    },
  });

  const updateUserRole = useMutation({
    mutationFn: async (variables: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: variables.role })
        .eq('user_id', variables.userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">User Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-foreground">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Role</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-b border-border">
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  {user.firstName} {user.lastName}
                </td>
                <td className="py-3 px-4">{user.role}</td>
                <td className="py-3 px-4">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole.mutate({ 
                      userId: user.id, 
                      role: e.target.value as AppRole 
                    })}
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
      </div>
    </div>
  );
};

export default UsersManagement;
