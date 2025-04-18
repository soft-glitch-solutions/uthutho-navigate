
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Users, MapPin, Clock, Home, Route } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { OverviewSkeleton } from '@/components/admin/OverviewSkeleton';

interface OverviewPageProps {
  usersCount: number;
  hubsCount: number;
  stopsCount: number;
  waitingCount: number;
}

const OverviewPage: React.FC<OverviewPageProps> = ({ 
  usersCount, 
  hubsCount, 
  stopsCount, 
  waitingCount 
}) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [
        { count: usersCount },
        { count: hubsCount },
        { count: stopsCount },
        { count: routesCount },
        { count: waitingCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('hubs').select('*', { count: 'exact' }),
        supabase.from('stops').select('*', { count: 'exact' }),
        supabase.from('routes').select('*', { count: 'exact' }),
        supabase.from('stop_waiting')
          .select('*', { count: 'exact' })
          .gte('expires_at', new Date().toISOString())
      ]);

      return {
        usersCount: usersCount || 0,
        hubsCount: hubsCount || 0,
        stopsCount: stopsCount || 0,
        routesCount: routesCount || 0,
        waitingCount: waitingCount || 0,
      };
    }
  });

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      <Link to="/admin/dashboard/users" className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border hover:bg-accent/10 transition-colors">
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">Total Users</h3>
          <Users className="h-5 w-5 text-primary" />
        </div>
        <p className="text-3xl text-primary">{usersCount}</p>
      </Link>
      
      <Link to="/admin/dashboard/hubs" className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border hover:bg-accent/10 transition-colors">
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">Hubs</h3>
          <Home className="h-5 w-5 text-orange-500" />
        </div>
        <p className="text-3xl text-orange-500">{hubsCount}</p>
      </Link>
      
      <Link to="/admin/dashboard/routes" className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border hover:bg-accent/10 transition-colors">
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">Routes</h3>
          <Route className="h-5 w-5 text-accent" />
        </div>
        <p className="text-3xl text-accent">{stats?.routesCount || 0}</p>
      </Link>
      
      <Link to="/admin/dashboard/stops" className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border hover:bg-accent/10 transition-colors">
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">Active Stops</h3>
          <MapPin className="h-5 w-5 text-secondary" />
        </div>
        <p className="text-3xl text-secondary">{stopsCount}</p>
      </Link>
      
      <Card className="p-6">
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">People Waiting</h3>
          <Clock className="h-5 w-5 text-blue-500" />
        </div>
        <p className="text-3xl text-blue-500">{waitingCount}</p>
      </Card>

      {/* HERE Maps Container */}
      <div className="col-span-1 sm:col-span-2 md:col-span-3">
        <div id="map" style={{ width: '100%', height: '400px', marginTop: '20px' }} className="rounded-lg border border-border"></div>
      </div>
    </div>
  );
};

export default OverviewPage;
