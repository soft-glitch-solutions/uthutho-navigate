
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Users, Settings, LogOut, Sun, Moon, FileText, StopCircle, Inbox, MapPin } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar = ({ activeTab, setActiveTab, onLogout }: SidebarProps) => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  return (
    <aside className="w-64 bg-card fixed h-full border-r border-border">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <img
            src="/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png"
            alt="Uthutho Logo"
            className="h-8 w-8"
          />
          <span className="text-xl font-bold text-primary">Admin</span>
        </div>
      </div>

      <nav className="mt-6">
        <Link
          to="/admin/dashboard"
          className={`flex items-center w-full px-6 py-3 text-foreground ${activeTab === 'dashboard' ? 'bg-primary/20' : 'hover:bg-accent/10'}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard className="h-5 w-5 mr-3" />
          Overview
        </Link>
        <Link
          to="/admin/dashboard/stops"
          className={`flex items-center w-full px-6 py-3 text-foreground ${activeTab === 'stops' ? 'bg-primary/20' : 'hover:bg-accent/10'}`}
          onClick={() => setActiveTab('stops')}
        >
          <StopCircle className="h-5 w-5 mr-3" />
          Stops
        </Link>
        <Link
          to="/admin/dashboard/nearby-spots"
          className={`flex items-center w-full px-6 py-3 text-foreground ${activeTab === 'nearby-spots' ? 'bg-primary/20' : 'hover:bg-accent/10'}`}
          onClick={() => setActiveTab('nearby-spots')}
        >
          <MapPin className="h-5 w-5 mr-3" />
          Nearby Spots
        </Link>
        <Link
          to="/admin/dashboard/requests"
          className={`flex items-center w-full px-6 py-3 text-foreground ${activeTab === 'requests' ? 'bg-primary/20' : 'hover:bg-accent/10'}`}
          onClick={() => setActiveTab('requests')}
        >
          <Inbox className="h-5 w-5 mr-3" />
          Requests
        </Link>
        <Link
          to="/admin/dashboard/profile"
          className={`flex items-center w-full px-6 py-3 text-foreground ${activeTab === 'profile' ? 'bg-primary/20' : 'hover:bg-accent/10'}`}
          onClick={() => setActiveTab('profile')}
        >
          <User className="h-5 w-5 mr-3" />
          Profile
        </Link>
        <Link
          to="/admin/dashboard/users"
          className={`flex items-center w-full px-6 py-3 text-foreground ${activeTab === 'users' ? 'bg-primary/20' : 'hover:bg-accent/10'}`}
          onClick={() => setActiveTab('users')}
        >
          <Users className="h-5 w-5 mr-3" />
          Users
        </Link>
        <Link
          to="/admin/dashboard/reports"
          className={`flex items-center w-full px-6 py-3 text-foreground ${activeTab === 'reports' ? 'bg-primary/20' : 'hover:bg-accent/10'}`}
          onClick={() => setActiveTab('reports')}
        >
          <FileText className="h-5 w-5 mr-3" />
          Reports
        </Link>
        <Link
          to="/admin/dashboard/settings"
          className={`flex items-center w-full px-6 py-3 text-foreground ${activeTab === 'settings' ? 'bg-primary/20' : 'hover:bg-accent/10'}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </Link>
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
          onClick={onLogout}
          className="flex items-center w-full px-4 py-2 text-foreground hover:bg-accent/10 rounded-lg"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
