
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlusCircle, MinusCircle, MapPin, Route, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import LocationMap from '@/components/maps/LocationMap';

const TravelMapsPage = () => {
  const [activeTab, setActiveTab] = useState<'view' | 'create'>('view');
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [routeCompletion, setRouteCompletion] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Fetch hubs data
  const { data: hubs } = useQuery({
    queryKey: ['map-hubs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hubs')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch stops data
  const { data: stops } = useQuery({
    queryKey: ['map-stops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stops')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch routes data
  const { data: routes } = useQuery({
    queryKey: ['map-routes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routes')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch route stops data for visualization
  const { data: routeStops } = useQuery({
    queryKey: ['map-route-stops', selectedRoute],
    enabled: !!selectedRoute,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('route_stops')
        .select('*, stops(*)')
        .eq('route_id', selectedRoute)
        .order('order_number', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Create map objects for the LocationMap component
  const mapObjects = React.useMemo(() => {
    let objects: any[] = [];
    
    // Add hubs
    if (hubs) {
      objects = [
        ...objects, 
        ...hubs.map(hub => ({
          ...hub,
          type: 'hub'
        }))
      ];
    }

    // Add stops
    if (stops) {
      objects = [
        ...objects,
        ...stops.map(stop => ({
          ...stop,
          type: 'stop'
        }))
      ];
    }

    // If route is selected, add route stops
    if (selectedRoute && routeStops) {
      // This will be handled in a separate effect to draw the route
    }

    return objects;
  }, [hubs, stops, selectedRoute, routeStops]);
  
  const handleRouteSelect = (routeId: string) => {
    setSelectedRoute(routeId);
    setActiveTab('view');
  };

  const getGoogleMapsUrl = () => {
    if (!routeStops || routeStops.length < 2) return '';
    
    let url = 'https://www.google.com/maps/dir/?api=1';
    
    // Get first stop as origin
    const origin = routeStops[0].stops;
    url += `&origin=${origin.latitude},${origin.longitude}`;
    
    // Get last stop as destination
    const destination = routeStops[routeStops.length - 1].stops;
    url += `&destination=${destination.latitude},${destination.longitude}`;
    
    // Add waypoints if there are any intermediate stops
    if (routeStops.length > 2) {
      const waypoints = routeStops.slice(1, -1).map(rs => `${rs.stops.latitude},${rs.stops.longitude}`).join('|');
      url += `&waypoints=${waypoints}`;
    }
    
    url += '&travelmode=driving';
    
    return url;
  };

  // Add activity log for viewing a route
  const logRouteView = async (routeId: string) => {
    try {
      const selectedRouteName = routes?.find(r => r.id === routeId)?.name || 'Unknown route';
      
      await supabase
        .from('activity_logs')
        .insert([{
          action: 'view_route_map',
          details: { route_id: routeId, route_name: selectedRouteName },
          page_url: window.location.href,
          user_agent: navigator.userAgent
        }]);
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  const handleHubClick = (hubId: string) => {
    navigate(`/admin/dashboard/hubs/${hubId}`);
  };

  const handleStopClick = (stopId: string) => {
    navigate(`/admin/dashboard/stops/${stopId}`);
  };

  const filteredRoutes = routes?.filter(route => 
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.start_point.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.end_point.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.transport_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Travel Maps</CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Routes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex space-x-2">
                  <Button 
                    variant={activeTab === 'view' ? 'default' : 'outline'} 
                    onClick={() => setActiveTab('view')}
                    className="flex-1"
                  >
                    View Routes
                  </Button>
                  <Button 
                    variant={activeTab === 'create' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('create')}
                    className="flex-1"
                  >
                    Create Route
                  </Button>
                </div>
              </div>
              
              {activeTab === 'view' && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search routes..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <h3 className="font-medium">Select a route to view:</h3>
                  {filteredRoutes && filteredRoutes.length > 0 ? (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {filteredRoutes.map((route) => (
                        <div 
                          key={route.id}
                          onClick={() => {
                            handleRouteSelect(route.id);
                            logRouteView(route.id);
                          }}
                          className={`p-3 border rounded-md cursor-pointer hover:bg-accent transition-colors ${
                            selectedRoute === route.id ? 'border-primary bg-accent' : 'border-border'
                          }`}
                        >
                          <div className="font-medium">{route.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {route.start_point} → {route.end_point}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {route.transport_type}
                          </div>
                          {selectedRoute === route.id && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">Completion</span>
                                <span className="text-xs font-medium">{routeCompletion}%</span>
                              </div>
                              <Slider
                                value={[routeCompletion]}
                                max={100}
                                step={1}
                                disabled
                                className="cursor-default"
                              />
                              {routeStops && routeStops.length >= 2 && (
                                <div className="mt-3">
                                  <a 
                                    href={getGoogleMapsUrl()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline flex items-center"
                                  >
                                    <MapPin className="h-3 w-3 mr-1" />
                                    View in Google Maps
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'No matching routes found' : 'No routes available'}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'create' && (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
                    <p>Route creation is available in the Routes page.</p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto mt-2 text-primary" 
                      onClick={() => {
                        navigate('/admin/dashboard/routes');
                      }}
                    >
                      Go to Routes Management
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="w-full h-[calc(100vh-12rem)] flex flex-col">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <span>Transport Hubs and Stops</span>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-600 mr-1"></div>
                      <span>Hubs ({hubs?.length || 0})</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-400 mr-1"></div>
                      <span>Stops ({stops?.length || 0})</span>
                    </div>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <LocationMap 
              className="flex-1 rounded-b-lg overflow-hidden"
              mapObjects={mapObjects}
              onHubClick={handleHubClick}
              onStopClick={handleStopClick}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TravelMapsPage;
