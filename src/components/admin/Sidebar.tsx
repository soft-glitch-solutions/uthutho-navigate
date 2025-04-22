
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import SidebarLinks from './SidebarLinks';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    // Ask for confirmation before logging out
    if (window.confirm('Are you sure you want to log out?')) {
      onLogout();
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen w-64 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png" 
            alt="Uthutho Logo" 
            className="h-8 w-8 mr-2"
          />
          <h1 className="text-xl font-bold">Uthutho</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <SidebarLinks activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      <div className="p-4 border-t border-border">
        <Button 
          variant="outline" 
          className="w-full justify-start bg-transparent border-border text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
