import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LayoutDashboard, User, Users, Settings, LogOut, MapPin, Sun, Moon, Route, Search } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import OverviewPage from './OverviewPage';
import ProfilePage from './ProfilePage';
import UsersPage from './UsersPage';
import SettingsPage from './SettingsPage';
import HubsPage from './HubsPage';
import RoutesPage from './RoutesPage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type AppRole = "admin" | "user";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [usersCount, setUsersCount] = useState(0);
  const [hubsCount, setHubsCount] = useState(0);
  const [dailyTripsCount, setDailyTripsCount] = useState(0);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();

  // Add search states
  const [searchUsers, setSearchUsers] = useState('');

  // Function to check if the user is authenticated
  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
    }
  };

  // Fetch overview data
  const { data: overviewData } = useQuery({
    queryKey: ['overview'],
    queryFn: async () => {
      const users = await supabase
        .from('user_roles')
        .select('*', { count: 'exact' });

      const hubs = await supabase
        .from('hubs')
        .select('*', { count: 'exact' });

      const routes = await supabase
        .from('routes')
        .select('*', { count: 'exact' });

      return {
        usersCount: users.count || 0,
        hubsCount: hubs.count || 0,
        routesCount: routes.count || 0,
      };
    },
  });

  // Fetch users with roles
  const { data: users, isLoading: isLoadingUsers } = useQuery({
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

      // Fetch emails from auth.users (this requires separate query)
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const userMap = new Map(authUsers.users.map(u => [u.id, u.email]));

      return userRoles.map((ur: any) => ({
        id: ur.user_id,
        email: userMap.get(ur.user_id) || '',
        firstName: ur.profiles.first_name,
        lastName: ur.profiles.last_name,
        role: ur.role,
      }));
    },
  });

  const filteredUsers = users?.filter(user =>
    user.email.toLowerCase().includes(searchUsers.toLowerCase()) ||
    (user.firstName && user.firstName.toLowerCase().includes(searchUsers.toLowerCase())) ||
    (user.lastName && user.lastName.toLowerCase().includes(searchUsers.toLowerCase()))
  );

  useEffect(() => {
    checkAuth();
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    // Fetch users count
    const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact' });
    setUsersCount(usersCount);

    // Fetch hubs count
    const { count: hubsCount } = await supabase.from('hubs').select('*', { count: 'exact' });
    setHubsCount(hubsCount);

    // Fetch daily trips count (assuming you have a `trips` table)
    const { count: dailyTripsCount } = await supabase.from('trips').select('*', { count: 'exact' });
    setDailyTripsCount(dailyTripsCount);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  // Handle theme toggle
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const updateUserRole = useMutation(
    async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', userId)
        .select();
  
      if (error) {
        console.error('Update role failed:', error);
        throw error;
      }
  
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
      },
      onError: (error) => {
        console.error('Update role mutation error:', error);
      },
    }
  );

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
            onClick={() => setActiveTab('hubs')}
            className={`flex items-center w-full px-6 py-3 text-foreground ${activeTab === 'hubs' ? 'bg-primary/20' : 'hover:bg-accent/10'}`}
          >
            <MapPin className="h-5 w-5 mr-3" />
            Hubs
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`flex items-center w-full px-6 py-3 text-foreground ${activeTab === 'routes' ? 'bg-primary/20' : 'hover:bg-accent/10'}`}
          >
            <Route className="h-5 w-5 mr-3" />
            Routes
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
            onClick={toggleTheme}
            className="flex items-center w-full px-4 py-2 text-foreground hover:bg-accent/10 rounded-lg"
          >
            {/* Theme switch */}
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
                <p className="text-3xl text-primary">{overviewData?.usersCount || 0}</p>
              </div>
              <div className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2">Active Hubs</h3>
                <p className="text-3xl text-secondary">{overviewData?.hubsCount || 0}</p>
              </div>
              <div className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2">Total Routes</h3>
                <p className="text-3xl text-accent">{overviewData?.routesCount || 0}</p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && <ProfilePage profile={{ firstName: '', lastName: '', email: '' }} onProfileUpdate={() => {}} />}

          {activeTab === 'users' && (
            <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-foreground">User Management</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchUsers}
                    onChange={(e) => setSearchUsers(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground"
                  />
                </div>
              </div>

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
                    {filteredUsers?.map((user) => (
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
          )}

          {activeTab === 'hubs' && <HubsPage />}
          {activeTab === 'routes' && <RoutesPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
