import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LayoutDashboard, User, Users, Settings, LogOut, Sun, Moon, FileText } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];
type ReportStatus = 'pending' | 'approved' | 'rejected';

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
}

interface TrafficReport {
  id: string;
  location: string;
  description: string;
  incident_type: string;
  status: ReportStatus;
  incident_time: string;
  created_at: string;
  reporter: {
    first_name: string;
    last_name: string;
  } | null;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchReports, setSearchReports] = useState('');
  const [profile, setProfile] = useState<Profile>({
    firstName: '',
    lastName: '',
    email: ''
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();

  const { data: overviewData } = useQuery({
    queryKey: ['overview'],
    queryFn: async () => {
      const { count: userCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      const { count: hubCount } = await supabase
        .from('hubs')
        .select('*', { count: 'exact', head: true });

      const { count: routeCount } = await supabase
        .from('routes')
        .select('*', { count: 'exact', head: true });

      return {
        usersCount: userCount || 0,
        hubsCount: hubCount || 0,
        routesCount: routeCount || 0,
      };
    },
  });

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
      
      return userRoles.map((ur: any) => ({
        id: ur.user_id,
        email: authUsers.find(u => u.id === ur.user_id)?.email || '',
        firstName: ur.profiles.first_name,
        lastName: ur.profiles.last_name,
        role: ur.role as AppRole,
      }));
    },
  });

  const { data: reports } = useQuery({
    queryKey: ['traffic-reports'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('traffic_reports')
        .select(`
          *,
          reporter:profiles(
            first_name,
            last_name
          )
        `)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TrafficReport[];
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

  const updateReportStatus = useMutation({
    mutationFn: async ({ reportId, status }: { reportId: string; status: ReportStatus }) => {
      const { error } = await supabase
        .from('traffic_reports')
        .update({ status })
        .eq('id', reportId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['traffic-reports'] });
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
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile({
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          email: user.email || '',
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

  const filteredReports = reports?.filter(report =>
    report.location.toLowerCase().includes(searchReports.toLowerCase()) ||
    report.description.toLowerCase().includes(searchReports.toLowerCase()) ||
    report.incident_type.toLowerCase().includes(searchReports.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
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
            onClick={() => setActiveTab('reports')}
            className={`flex items-center w-full px-6 py-3 text-foreground ${activeTab === 'reports' ? 'bg-primary/20' : 'hover:bg-accent/10'}`}
          >
            <FileText className="h-5 w-5 mr-3" />
            Reports
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
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Save Changes
                </button>
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
          )}
          
          {activeTab === 'reports' && (
            <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-foreground">Today's Traffic Reports</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchReports}
                    onChange={(e) => setSearchReports(e.target.value)}
                    className="px-4 py-2 border border-border rounded-md bg-background text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredReports?.length === 0 ? (
                  <p className="text-muted-foreground">No traffic reports for today.</p>
                ) : (
                  filteredReports?.map((report) => (
                    <div
                      key={report.id}
                      className="bg-background p-4 rounded-lg border border-border"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-foreground">{report.incident_type}</h3>
                          <p className="text-sm text-muted-foreground">{report.location}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            report.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                            report.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                            'bg-red-500/10 text-red-500'
                          }`}>
                            {report.status.toUpperCase()}
                          </span>
                          <select
                            value={report.status}
                            onChange={(e) => updateReportStatus.mutate({
                              reportId: report.id,
                              status: e.target.value as ReportStatus
                            })}
                            className="bg-background text-foreground text-sm border border-border rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approve</option>
                            <option value="rejected">Reject</option>
                          </select>
                        </div>
                      </div>
                      <p className="text-sm text-foreground mb-2">{report.description}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>
                          Reported by: {report.reporter?.first_name} {report.reporter?.last_name}
                        </span>
                        <span>
                          {format(new Date(report.incident_time), 'MMM d, yyyy HH:mm')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Appearance</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Theme</span>
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="px-4 py-2 border border-border rounded-md bg-background text-foreground hover:bg-accent/10"
                  >
                    {theme === 'dark' ? (
                      <Sun className="h-5 w-5 mr-2 inline-block" />
                    ) : (
                      <Moon className="h-5 w-5 mr-2 inline-block" />
                    )}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </button>
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
