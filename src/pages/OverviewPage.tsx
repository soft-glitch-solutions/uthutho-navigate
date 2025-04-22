
import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Users, MapPin, Clock, Home, Route } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { OverviewSkeleton } from '@/components/admin/OverviewSkeleton';
import { HERE_API_KEY } from '@/integrations/here-config';

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
  // Create a ref for the map container
  const mapContainerRef = useRef<HTMLDivElement>(null);

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
        supabase.from('hubs').select('id, name, latitude, longitude'),
        supabase.from('stops').select('id, name, latitude, longitude')
      ]);
      
      return { hubs, stops };
    }
  });

  useEffect(() => {
    if (!mapData || !mapData.hubs || !mapData.stops || !mapContainerRef.current) return;

    try {
      // Initialize HERE Map
      const platform = new window.H.service.Platform({
        apikey: HERE_API_KEY
      });
      
      const defaultLayers = platform.createDefaultLayers();
      
      // Initialize the map only if map container exists
      const mapElement = mapContainerRef.current;
      if (!mapElement) {
        console.error('Map container element not found');
        return;
      }

      // Initialize the map
      const map = new window.H.Map(
        mapElement,
        defaultLayers.vector.normal.map,
        {
          zoom: 5,
          center: { lat: -30.5595, lng: 22.9375 } // Center of South Africa
        }
      );

      // Add UI controls
      const ui = window.H.ui.UI.createDefault(map, defaultLayers);
      
      // Enable map interaction (pan, zoom)
      new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));

      // Create marker groups
      const hubsGroup = new window.H.map.Group();
      const stopsGroup = new window.H.map.Group();
      map.addObject(hubsGroup);
      map.addObject(stopsGroup);

      // Add hubs to the map
      mapData.hubs.forEach(hub => {
        if (hub && typeof hub.latitude === 'number' && typeof hub.longitude === 'number') {
          const marker = new window.H.map.Marker(
            { lat: hub.latitude, lng: hub.longitude },
            {
              data: hub,
              icon: new window.H.map.Icon('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#1E40AF" stroke="white" stroke-width="2"/></svg>', {size: {w: 24, h: 24}})
            }
          );
          hubsGroup.addObject(marker);
        }
      });

      // Add stops to the map
      mapData.stops.forEach(stop => {
        if (stop && typeof stop.latitude === 'number' && typeof stop.longitude === 'number') {
          const marker = new window.H.map.Marker(
            { lat: stop.latitude, lng: stop.longitude },
            {
              data: stop,
              icon: new window.H.map.Icon('<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" fill="#38BDF8" stroke="white" stroke-width="2"/></svg>', {size: {w: 20, h: 20}})
            }
          );
          stopsGroup.addObject(marker);
        }
      });

      // If we have points, calculate the viewport that contains all of them
      if ((mapData.hubs && mapData.hubs.length > 0) || (mapData.stops && mapData.stops.length > 0)) {
        const allPoints = [...(mapData.hubs || []), ...(mapData.stops || [])].filter(
          p => p && typeof p.latitude === 'number' && typeof p.longitude === 'number'
        );
        
        if (allPoints.length > 0) {
          const bounds = new window.H.geo.Rect(
            allPoints.reduce((min, p) => Math.min(min, p.latitude), 90),
            allPoints.reduce((min, p) => Math.min(min, p.longitude), 180),
            allPoints.reduce((max, p) => Math.max(max, p.latitude), -90),
            allPoints.reduce((max, p) => Math.max(max, p.longitude), -180)
          );
          
          map.getViewModel().setLookAtData({
            bounds: bounds
          }, true);
        }
      }

      // Clean up
      return () => {
        if (map) {
          map.dispose();
        }
      };
    } catch (error) {
      console.error('Error initializing HERE map:', error);
    }
  }, [mapData]);

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

      <Link to="/admin/dashboard/travel-maps" className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border hover:bg-accent/10 transition-colors">
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">View Full Map</h3>
          <MapPin className="h-5 w-5 text-blue-500" />
        </div>
        <p className="text-sm text-muted-foreground">Click to view detailed map</p>
      </Link>

      {/* HERE Maps Container */}
      <div className="col-span-1 sm:col-span-2 md:col-span-3">
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="p-3 bg-card border-b border-border flex justify-between items-center">
            <h3 className="font-medium">Transport Network Overview</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-600 mr-1"></div>
                <span>Hubs</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-400 mr-1"></div>
                <span>Stops</span>
              </div>
            </div>
          </div>
          <div ref={mapContainerRef} style={{ height: '400px' }} className="w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
