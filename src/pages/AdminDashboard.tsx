
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LayoutDashboard, Users, MapPin, Settings, LogOut, Plus, Edit, Trash2, Sun, Moon, User } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface Hub {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
}

interface User {
  id: string;
  email: string;
  role: AppRole;
}

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedHub, setSelectedHub] = useState<Hub | null>(null);
  const [profile, setProfile] = useState<Profile>({
    firstName: '',
    lastName: '',
    email: ''
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();

  // Fetch users with roles
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          auth.users!inner (
            email
          )
        `);
      if (error) throw error;
      return userRoles.map((ur: any) => ({
        id: ur.user_id,
        email: ur.users.email,
        role: ur.role as AppRole,
      }));
    },
  });

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updatedProfile: Profile) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: updatedProfile.firstName,
          last_name: updatedProfile.lastName
        })
        .eq('id', user.id);

      if (error) throw error;
      return updatedProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  useEffect(() => {
    checkAuth();
    fetchProfile();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
    }
  };

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      if (profile && !error) {
        setProfile({
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          email: user.email || ''
        });
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(profile);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card fixed h-full border-r border-border">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png" 
              alt="Uthutho Maps Logo" 
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-primary">Admin</span>
          </div>
        </div>
        
        <nav className="mt-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center w-full px-6 py-3 text-foreground ${activeTab === 'overview' ? 'bg-primary/20' : 'hover:bg-accent/10'}`}
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center w-full px-6 py-3 text-foreground ${activeTab === 'profile' ? 'bg-primary/20' : 'hover:bg-accent/10'}`}
          >
            <User className="h-5 w-5 mr-3" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center w-full px-6 py-3 text-foreground ${activeTab === 'users' ? 'bg-primary/20' : 'hover:bg-accent/10'}`}
          >
            <Users className="h-5 w-5 mr-3" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center w-full px-6 py-3 text-foreground ${activeTab === 'settings' ? 'bg-primary/20' : 'hover:bg-accent/10'}`}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </button>
        </nav>

        <div className="absolute bottom-0 w-64 p-6 space-y-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center w-full px-4 py-2 text-foreground hover:bg-accent/10 rounded-lg"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 mr-3" />
            ) : (
              <Moon className="h-5 w-5 mr-3" />
            )}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-foreground hover:bg-accent/10 rounded-lg"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2">Total Users</h3>
                <p className="text-3xl text-primary">{users?.length || 0}</p>
              </div>
              <div className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2">Active Hubs</h3>
                <p className="text-3xl text-secondary">--</p>
              </div>
              <div className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2">Daily Trips</h3>
                <p className="text-3xl text-accent">--</p>
              </div>
            </div>
          )}
          
          {activeTab === 'profile' && (
            <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Profile Settings</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    className="w-full p-2 rounded-md bg-background border border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    className="w-full p-2 rounded-md bg-background border border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full p-2 rounded-md bg-background/50 border border-border text-foreground/50"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </form>
            </div>
          )}
          
          {activeTab === 'users' && (
            <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">User Management</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-foreground">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Role</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.map((user) => (
                      <tr key={user.id} className="border-b border-border">
                        <td className="py-3 px-4">{user.email}</td>
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
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Appearance</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Theme</span>
                  <Button
                    variant="outline"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  >
                    {theme === 'dark' ? (
                      <Sun className="h-5 w-5 mr-2" />
                    ) : (
                      <Moon className="h-5 w-5 mr-2" />
                    )}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
