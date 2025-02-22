import { LayoutDashboard, Users, Settings, LogOut, Sun, Moon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
}

const Sidebar = ({ activeTab, setActiveTab, handleLogout }: SidebarProps) => {
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
        <Button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center w-full px-4 py-2 text-foreground hover:bg-accent/10 rounded-lg"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5 mr-3" /> : <Moon className="h-5 w-5 mr-3" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Button>
        <Button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-foreground hover:bg-accent/10 rounded-lg"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
