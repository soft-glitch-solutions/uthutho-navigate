import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, User, Users, FileText, 
  Inbox, MapPin, Clock, LifeBuoy, HelpCircle, MessageSquare
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar = ({ activeTab, setActiveTab, onLogout }: SidebarProps) => {
  return (
    <aside className="w-64 bg-card h-full border-r border-border overflow-y-auto">
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
      </nav>

      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="px-6 text-sm font-medium text-muted-foreground mb-2">Support</h3>
        <Link
          to="/admin/dashboard/help"
          className={`flex items-center w-full px-6 py-3 text-foreground ${activeTab === 'help' ? 'bg-primary/20' : 'hover:bg-accent/10'}`}
          onClick={() => setActiveTab('help')}
        >
          <HelpCircle className="h-5 w-5 mr-3" />
          Documentation
        </Link>
        <Link
          to="/admin/dashboard/support"
          className={`flex items-center w-full px-6 py-3 text-foreground ${activeTab === 'support' ? 'bg-primary/20' : 'hover:bg-accent/10'}`}
          onClick={() => setActiveTab('support')}
        >
          <MessageSquare className="h-5 w-5 mr-3" />
          Support Tickets
        </Link>
        <Link
          to="/admin/dashboard/logs"
          className={`flex items-center w-full px-6 py-3 text-foreground ${activeTab === 'logs' ? 'bg-primary/20' : 'hover:bg-accent/10'}`}
          onClick={() => setActiveTab('logs')}
        >
          <Clock className="h-5 w-5 mr-3" />
          System Logs
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
