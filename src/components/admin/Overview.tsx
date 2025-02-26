
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Overview = () => {
  const { data: overviewData } = useQuery({
    queryKey: ['overview'],
    queryFn: async () => {
      const { count: userCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      const { count: hubCount } = await supabase
        .from('hubs')
        .select('*', { count: 'exact', head: true });

      const { count: routeCount } = await supabase
        .from('routes')
        .select('*', { count: 'exact', head: true });

      return {
        usersCount: userCount || 0,
        hubsCount: hubCount || 0,
        routesCount: routeCount || 0,
      };
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">Total Users</h3>
        <p className="text-3xl text-primary">{overviewData?.usersCount || 0}</p>
      </div>
      <div className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">Active Hubs</h3>
        <p className="text-3xl text-secondary">{overviewData?.hubsCount || 0}</p>
      </div>
      <div className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">Total Routes</h3>
        <p className="text-3xl text-accent">{overviewData?.routesCount || 0}</p>
      </div>
    </div>
  );
};

export default Overview;
