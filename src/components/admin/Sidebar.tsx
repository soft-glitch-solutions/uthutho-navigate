
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Users, Settings, LogOut, Sun, Moon, FileText, MapPin, Route } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar = ({ activeTab, setActiveTab, onLogout }: SidebarProps) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
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
          onClick={() => navigate('/admin/hubs')}
          className="flex items-center w-full px-6 py-3 text-foreground hover:bg-accent/10"
        >
          <MapPin className="h-5 w-5 mr-3" />
          Hubs
        </button>
        <button
          onClick={() => navigate('/admin/routes')}
          className="flex items-center w-full px-6 py-3 text-foreground hover:bg-accent/10"
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
