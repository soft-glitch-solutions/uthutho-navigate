import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LayoutDashboard, User, Users, Settings, LogOut, MapPin, Sun, Moon, Route } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import OverviewPage from './OverviewPage';
import ProfilePage from './ProfilePage';
import UsersPage from './UsersPage';
import SettingsPage from './SettingsPage';
import HubsPage from './HubsPage';
import RoutesPage from './RoutesPage';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [usersCount, setUsersCount] = useState(0);
  const [hubsCount, setHubsCount] = useState(0);
  const [dailyTripsCount, setDailyTripsCount] = useState(0);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Function to check if the user is authenticated
  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
    }
  };

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
            <OverviewPage
              usersCount={usersCount}
              hubsCount={hubsCount}
              dailyTripsCount={dailyTripsCount}
            />
          )}
          {activeTab === 'profile' && <ProfilePage profile={{ firstName: '', lastName: '', email: '' }} onProfileUpdate={() => {}} />}
          {activeTab === 'users' && <UsersPage />}
          {activeTab === 'hubs' && <HubsPage />}
          {activeTab === 'routes' && <RoutesPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
