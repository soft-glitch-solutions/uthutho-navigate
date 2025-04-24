
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { OverviewSkeleton } from '@/components/admin/OverviewSkeleton';
import StatsGrid from '@/components/admin/dashboard/StatsGrid';
import MapSection from '@/components/admin/dashboard/MapSection';

const OverviewPage = () => {
  const navigate = useNavigate();

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

  const { data: mapData } = useQuery({
    queryKey: ['map-data'],
    queryFn: async () => {
      const [{ data: hubs }, { data: stops }] = await Promise.all([
        supabase.from('hubs').select('id, name, latitude, longitude, address'),
        supabase.from('stops').select('id, name, latitude, longitude, order_number')
      ]);
      
      const mapObjects = [
        ...(hubs || []).map(hub => ({
          ...hub,
          type: 'hub'
        })),
        ...(stops || []).map(stop => ({
          ...stop,
          type: 'stop'
        }))
      ];

      return mapObjects;
    }
  });

  const handleHubClick = (hubId: string) => {
    navigate(`/admin/dashboard/hubs/${hubId}`);
  };

  const handleStopClick = (stopId: string) => {
    navigate(`/admin/dashboard/stops/${stopId}`);
  };

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      <StatsGrid {...stats} />
      <MapSection 
        mapObjects={mapData || []}
        onHubClick={handleHubClick}
        onStopClick={handleStopClick}
      />
    </div>
  );
};

export default OverviewPage;
