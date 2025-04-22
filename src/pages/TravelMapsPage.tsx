
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { HERE_API_KEY } from '@/integrations/here-config';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlusCircle, MinusCircle, MapPin, Route } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TravelMapsPage = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'view' | 'create'>('view');
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [routeCompletion, setRouteCompletion] = useState(0);
  const [mapGroup, setMapGroup] = useState<any>(null);
  const [routesGroup, setRoutesGroup] = useState<any>(null);
  const { toast } = useToast();
  
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

  // Initialize map when components loads
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    try {
      // Initialize HERE Map
      const platform = new window.H.service.Platform({
        apikey: HERE_API_KEY
      });
      
      const defaultLayers = platform.createDefaultLayers();
      
      // Get map container element
      const mapElement = mapContainerRef.current;
      if (!mapElement) {
        console.error('Map container element not found');
        return;
      }

      // Initialize the map with South Africa as the center
      const mapInstance = new window.H.Map(
        mapElement,
        defaultLayers.vector.normal.map,
        {
          zoom: 5,
          center: { lat: -30.5595, lng: 22.9375 } // Center of South Africa
        }
      );

      setMap(mapInstance);

      // Add UI controls
      const ui = window.H.ui.UI.createDefault(mapInstance, defaultLayers);
      
      // Enable map interaction (pan, zoom)
      new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(mapInstance));

      // Add window resize listener
      const onWindowResize = () => mapInstance.getViewPort().resize();
      window.addEventListener('resize', onWindowResize);

      // Create marker groups
      const hubsGroup = new window.H.map.Group();
      const stopsGroup = new window.H.map.Group();
      const routesGroup = new window.H.map.Group();
      
      mapInstance.addObject(hubsGroup);
      mapInstance.addObject(stopsGroup);
      mapInstance.addObject(routesGroup);

      setMapGroup({ hubsGroup, stopsGroup });
      setRoutesGroup(routesGroup);

      // Clean up
      return () => {
        window.removeEventListener('resize', onWindowResize);
        if (mapInstance) {
          mapInstance.dispose();
        }
      };
    } catch (error) {
      console.error('Error initializing HERE map:', error);
      toast({
        title: "Map Error",
        description: "Failed to initialize the map. Please try refreshing the page.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Add hubs and stops to map when data is available
  useEffect(() => {
    if (!map || !mapGroup || !hubs || !stops) return;

    try {
      const { hubsGroup, stopsGroup } = mapGroup;
      
      // Clear previous markers
      hubsGroup.removeAll();
      stopsGroup.removeAll();

      // Add hubs to the map
      hubs.forEach(hub => {
        if (hub && typeof hub.latitude === 'number' && typeof hub.longitude === 'number') {
          const marker = new window.H.map.Marker(
            { lat: hub.latitude, lng: hub.longitude },
            {
              data: {
                type: 'hub',
                id: hub.id,
                name: hub.name
              },
              icon: new window.H.map.Icon('<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="14" fill="#1E40AF" stroke="white" stroke-width="2"/></svg>', {size: {w: 32, h: 32}})
            }
          );
          
          hubsGroup.addObject(marker);

          // Add info bubble for hub
          marker.addEventListener('tap', (evt) => {
            const bubble = new window.H.ui.InfoBubble(evt.target.getGeometry(), {
              content: `<div style="padding:10px;"><b>Hub:</b> ${hub.name}<br><b>Address:</b> ${hub.address || 'N/A'}</div>`
            });
            map.ui.addBubble(bubble);
          });
        }
      });

      // Add stops to the map
      stops.forEach(stop => {
        if (stop && typeof stop.latitude === 'number' && typeof stop.longitude === 'number') {
          const marker = new window.H.map.Marker(
            { lat: stop.latitude, lng: stop.longitude },
            {
              data: {
                type: 'stop',
                id: stop.id,
                name: stop.name
              },
              icon: new window.H.map.Icon('<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="12" fill="#38BDF8" stroke="white" stroke-width="2"/></svg>', {size: {w: 28, h: 28}})
            }
          );
          
          stopsGroup.addObject(marker);

          // Add info bubble for stop
          marker.addEventListener('tap', (evt) => {
            const bubble = new window.H.ui.InfoBubble(evt.target.getGeometry(), {
              content: `<div style="padding:10px;"><b>Stop:</b> ${stop.name}<br><b>Order:</b> ${stop.order_number || 'N/A'}</div>`
            });
            map.ui.addBubble(bubble);
          });
        }
      });

      // If we have points, calculate the viewport that contains all of them
      if (hubs.length > 0 || stops.length > 0) {
        const allPoints = [...hubs, ...stops].filter(
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
    } catch (error) {
      console.error('Error adding markers to map:', error);
    }
  }, [hubs, stops, map, mapGroup]);

  // Draw selected route path when route changes
  useEffect(() => {
    if (!map || !routesGroup || !routeStops || !routeStops.length) return;

    try {
      // Clear previous route drawings
      routesGroup.removeAll();

      // Get all stops in the correct order
      const coordinates = routeStops.map(rs => {
        const stop = rs.stops;
        return { lat: stop.latitude, lng: stop.longitude };
      });

      if (coordinates.length < 2) return;

      // Create a polyline for the route
      const routeLine = new window.H.map.Polyline(
        new window.H.geo.LineString(coordinates),
        {
          style: {
            lineWidth: 5,
            strokeColor: 'rgba(30, 64, 175, 0.8)',
            lineDash: [2, 2]
          }
        }
      );

      // Add markers for each stop in order
      routeStops.forEach((rs, index) => {
        const stop = rs.stops;
        const marker = new window.H.map.Marker(
          { lat: stop.latitude, lng: stop.longitude },
          {
            data: {
              type: 'route-stop',
              index: index + 1,
              name: stop.name
            },
            icon: new window.H.map.Icon(
              `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="11" fill="#1E40AF" stroke="white" stroke-width="2"/>
                <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="10px" font-weight="bold" font-family="Arial">${index + 1}</text>
              </svg>`,
              { size: { w: 24, h: 24 } }
            )
          }
        );
        
        routesGroup.addObject(marker);
      });

      // Add route polyline to the map
      routesGroup.addObject(routeLine);

      // Calculate completion percentage
      setRouteCompletion(Math.min(routeStops.length * 10, 100));

      // Zoom to the route
      map.getViewModel().setLookAtData({
        bounds: routeLine.getBoundingBox()
      });
    } catch (error) {
      console.error('Error drawing route:', error);
    }
  }, [routeStops, map, routesGroup]);

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
                  <h3 className="font-medium">Select a route to view:</h3>
                  {routes && routes.length > 0 ? (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {routes.map((route) => (
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
                      No routes available
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
                        // Navigate to routes page
                        window.location.href = '/admin/dashboard/routes';
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
            <div ref={mapContainerRef} className="flex-1 rounded-b-lg overflow-hidden"></div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TravelMapsPage;
