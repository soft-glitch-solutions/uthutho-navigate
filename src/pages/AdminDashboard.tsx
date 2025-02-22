
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LayoutDashboard, Users, MapPin, Settings, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 backdrop-blur-sm border-r border-white/10">
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
            className={`flex items-center w-full px-6 py-3 text-white ${activeTab === 'overview' ? 'bg-primary/20' : 'hover:bg-white/5'}`}
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center w-full px-6 py-3 text-white ${activeTab === 'users' ? 'bg-primary/20' : 'hover:bg-white/5'}`}
          >
            <Users className="h-5 w-5 mr-3" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`flex items-center w-full px-6 py-3 text-white ${activeTab === 'routes' ? 'bg-primary/20' : 'hover:bg-white/5'}`}
          >
            <MapPin className="h-5 w-5 mr-3" />
            Routes
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center w-full px-6 py-3 text-white ${activeTab === 'settings' ? 'bg-primary/20' : 'hover:bg-white/5'}`}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </button>
        </nav>

        <div className="absolute bottom-0 w-64 p-6">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-white hover:bg-white/5 rounded-lg"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">Total Users</h3>
                <p className="text-3xl text-primary">1,234</p>
              </div>
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">Active Routes</h3>
                <p className="text-3xl text-secondary">56</p>
              </div>
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">Daily Trips</h3>
                <p className="text-3xl text-accent">789</p>
              </div>
            </div>
          )}
          
          {activeTab === 'users' && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">User Management</h2>
              {/* Add user management UI here */}
            </div>
          )}
          
          {activeTab === 'routes' && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Route Management</h2>
              {/* Add route management UI here */}
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Settings</h2>
              {/* Add settings UI here */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
