
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/admin/Sidebar';
import Overview from '@/components/admin/Overview';
import ProfileSettings from '@/components/admin/ProfileSettings';
import UsersManagement from '@/components/admin/UsersManagement';
import Reports from '@/components/admin/Reports';
import { useTheme } from '@/components/theme-provider';

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
    <div className="min-h-screen bg-background">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'users' && <UsersManagement />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'settings' && (
            <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Theme</span>
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="px-4 py-2 border border-border rounded-md bg-background text-foreground hover:bg-accent/10"
                  >
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
