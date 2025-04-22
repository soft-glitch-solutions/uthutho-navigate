
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Map,
  Route,
  MapPin,
  Coffee,
  MessageSquare,
  Users,
  BarChart,
  FileText,
  Settings,
  HelpCircle,
  User,
  History,
  FileDigit,
  LayoutDashboard,
  BookOpen,
  Newspaper
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarLink = ({ to, icon, text, isActive, onClick }: SidebarLinkProps) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-md transition-colors ${
        isActive ? 'bg-accent/40 text-accent-foreground' : 'hover:bg-accent/20'
      }`}
      onClick={onClick}
    >
      <span className="mr-3 text-muted-foreground">{icon}</span>
      <span className={isActive ? 'font-medium' : ''}>{text}</span>
    </Link>
  );
};

interface SidebarLinksProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SidebarLinks: React.FC<SidebarLinksProps> = ({ activeTab, setActiveTab }) => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'dashboard';

  const isLinkActive = (path: string) => {
    return currentPath === path || activeTab === path;
  };

  const handleClick = (tab: string) => {
    setActiveTab(tab);
  };

  const linkGroups = [
    {
      title: 'Main',
      links: [
        { to: '/admin/dashboard', icon: <Home size={18} />, text: 'Dashboard', id: 'dashboard' },
        { to: '/admin/dashboard/travel-maps', icon: <Map size={18} />, text: 'Travel Maps', id: 'travel-maps' },
      ]
    },
    {
      title: 'Transport',
      links: [
        { to: '/admin/dashboard/hubs', icon: <LayoutDashboard size={18} />, text: 'Hubs', id: 'hubs' },
        { to: '/admin/dashboard/routes', icon: <Route size={18} />, text: 'Routes', id: 'routes' },
        { to: '/admin/dashboard/stops', icon: <MapPin size={18} />, text: 'Stops', id: 'stops' },
        { to: '/admin/dashboard/nearby-spots', icon: <Coffee size={18} />, text: 'Nearby Spots', id: 'nearby-spots' },
      ]
    },
    {
      title: 'Management',
      links: [
        { to: '/admin/dashboard/requests', icon: <MessageSquare size={18} />, text: 'Requests', id: 'requests' },
        { to: '/admin/dashboard/users', icon: <Users size={18} />, text: 'Users', id: 'users' },
        { to: '/admin/dashboard/reports', icon: <BarChart size={18} />, text: 'Reports', id: 'reports' },
        { to: '/admin/dashboard/logs', icon: <History size={18} />, text: 'System Logs', id: 'logs' },
      ]
    },
    {
      title: 'Content',
      links: [
        { to: '/admin/dashboard/documentation', icon: <BookOpen size={18} />, text: 'Documentation', id: 'documentation' },
        { to: '/admin/dashboard/blogs', icon: <Newspaper size={18} />, text: 'Blogs', id: 'blogs' },
        { to: '/admin/dashboard/help', icon: <HelpCircle size={18} />, text: 'Help Articles', id: 'help' },
      ]
    },
    {
      title: 'Account',
      links: [
        { to: '/admin/dashboard/profile', icon: <User size={18} />, text: 'Profile', id: 'profile' },
        { to: '/admin/dashboard/settings', icon: <Settings size={18} />, text: 'Settings', id: 'settings' },
        { to: '/admin/dashboard/support', icon: <FileDigit size={18} />, text: 'Support', id: 'support' }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto py-2">
        <nav className="px-2 space-y-6">
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.links.map((link) => (
                  <SidebarLink
                    key={link.id}
                    to={link.to}
                    icon={link.icon}
                    text={link.text}
                    isActive={isLinkActive(link.id)}
                    onClick={() => handleClick(link.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SidebarLinks;
