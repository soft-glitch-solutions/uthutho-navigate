
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/admin/Sidebar';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    
    // Extract the active tab from the URL path
    const pathParts = location.pathname.split('/');
    // Get the last part of the path, or 'dashboard' if it's just /admin/dashboard
    const currentPath = pathParts.length > 2 ? pathParts[pathParts.length - 1] : 'dashboard';
    setActiveTab(currentPath);
  }, [location.pathname]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
      return;
    }

    // Check if user has admin role
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    if (error || (data && data.role !== 'admin')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this area.",
        variant: "destructive"
      });
      await supabase.auth.signOut();
      navigate('/admin');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
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
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
