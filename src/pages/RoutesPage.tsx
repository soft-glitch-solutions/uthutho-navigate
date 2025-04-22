import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, Map, Route, ArrowRight, MapPin, CirclePlus, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { parseGoogleMapsUrl } from '@/utils/googleMaps';
import { Slider } from '@/components/ui/slider';

interface Hub {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface Route {
  id: string;
  name: string;
  start_point: string;
  end_point: string;
  cost: number;
  transport_type: string;
  hub_id?: string;
  notes?: string | null;
}

const RoutesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [startPointUrl, setStartPointUrl] = useState('');
  const [endPointUrl, setEndPointUrl] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewRouteModalOpen, setIsNewRouteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [stopOrderMap, setStopOrderMap] = useState<Record<string, number>>({});
  const [routeCompletionPercentage, setRouteCompletionPercentage] = useState<Record<string, number>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: routes, isLoading: routesLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('routes').select('*');
      if (error) throw error;
      return data as Route[];
    },
  });

  const { data: hubs } = useQuery({
    queryKey: ['hubs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('hubs').select('id, name, latitude, longitude');
      if (error) throw error;
      return data as Hub[];
    },
  });

  const { data: stops } = useQuery({
    queryKey: ['stops'],
    queryFn: async () => {
      const { data, error } = await supabase.from('stops').select('*');
      if (error) throw error;
      return data as any[];
    },
  });

  const { data: routeStops } = useQuery({
    queryKey: ['route-stops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('route_stops')
        .select('route_id, stop_id, order_number');
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!routes || !routeStops) return;

    const stopsByRoute: Record<string, number> = {};
    
    routeStops.forEach(rs => {
      if (rs.route_id) {
        stopsByRoute[rs.route_id] = (stopsByRoute[rs.route_id] || 0) + 1;
      }
    });
    
    const percentages: Record<string, number> = {};
    routes.forEach(route => {
      const stopCount = stopsByRoute[route.id] || 0;
      percentages[route.id] = Math.min(stopCount * 10, 100);
    });
    
    setRouteCompletionPercentage(percentages);
  }, [routes, routeStops]);

  const updateRoute = useMutation({
    mutationFn: async (updatedRoute: Route) => {
      const { error } = await supabase
        .from('routes')
        .update(updatedRoute)
        .eq('id', updatedRoute.id);
      
      if (error) throw error;
      
      if (selectedStops.length > 0) {
        const { error: deleteError } = await supabase
          .from('route_stops')
          .delete()
          .eq('route_id', updatedRoute.id);
          
        if (deleteError) throw deleteError;
          
        const routeStopsToInsert = selectedStops.map((stopId) => ({
          route_id: updatedRoute.id,
          stop_id: stopId,
          order_number: stopOrderMap[stopId]
        }));
          
        const { error: insertError } = await supabase
          .from('route_stops')
          .insert(routeStopsToInsert);
            
        if (insertError) throw insertError;
      }
      
      await supabase.from('activity_logs').insert([{
        action: 'update_route',
        details: { 
          route_id: updatedRoute.id, 
          route_name: updatedRoute.name, 
          stops_count: selectedStops.length 
        }
      }]);
          
      return updatedRoute;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['route-stops'] });
      setIsEditModalOpen(false);
      toast({
        title: "Success",
        description: "Route has been updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update route: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const addNewRoute = useMutation({
    mutationFn: async (newRoute: Omit<Route, 'id'>) => {
      const { data, error } = await supabase
        .from('routes')
        .insert([newRoute])
        .select('id')
        .single();
      
      if (error) throw error;
      
      const routeId = data.id;
      
      if (selectedStops.length > 0) {
        const routeStopsToInsert = selectedStops.map((stopId) => ({
          route_id: routeId,
          stop_id: stopId,
          order_number: stopOrderMap[stopId]
        }));
        
        const { error: insertError } = await supabase
          .from('route_stops')
          .insert(routeStopsToInsert);
          
        if (insertError) throw insertError;
      }
      
      await supabase.from('activity_logs').insert([{
        action: 'create_route',
        details: { 
          route_id: routeId, 
          route_name: newRoute.name, 
          stops_count: selectedStops.length 
        }
      }]);
      
      return { ...newRoute, id: routeId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['route-stops'] });
      setIsNewRouteModalOpen(false);
      setStartPointUrl('');
      setEndPointUrl('');
      setSelectedStops([]);
      setStopOrderMap({});
      toast({
        title: "Success",
        description: "New route has been added successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add route: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const deleteRoute = useMutation({
    mutationFn: async (routeId: string) => {
      const { error } = await supabase.from('routes').delete().eq('id', routeId);
      if (error) throw error;
      return routeId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      setIsDeleteModalOpen(false);
      toast({
        title: "Success",
        description: "Route has been deleted successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete route: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleStartPointUrlChange = (url: string) => {
    setStartPointUrl(url);
    const locationName = url.split('place/')[1]?.split('/')[0]?.replace(/\+/g, ' ');
    
    if (selectedRoute && locationName) {
      setSelectedRoute({
        ...selectedRoute,
        start_point: decodeURIComponent(locationName) || selectedRoute.start_point
      });
    }
  };

  const handleEndPointUrlChange = (url: string) => {
    setEndPointUrl(url);
    const locationName = url.split('place/')[1]?.split('/')[0]?.replace(/\+/g, ' ');
    
    if (selectedRoute && locationName) {
      setSelectedRoute({
        ...selectedRoute,
        end_point: decodeURIComponent(locationName) || selectedRoute.end_point
      });
    }
  };

  const handleRouteEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoute) {
      updateRoute.mutate(selectedRoute);
    }
  };

  const handleNewRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoute) {
      if (!selectedRoute.name || !selectedRoute.start_point || !selectedRoute.end_point || !selectedRoute.transport_type) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      const newRoute = {
        name: selectedRoute.name,
        start_point: selectedRoute.start_point,
        end_point: selectedRoute.end_point,
        cost: selectedRoute.cost || 0,
        transport_type: selectedRoute.transport_type,
        hub_id: selectedRoute.hub_id,
        notes: selectedRoute.notes
      };
      
      addNewRoute.mutate(newRoute);
    }
  };

  const handleRouteSelect = (route: Route) => {
    navigate(`/admin/dashboard/routes/${route.id}`);
  };

  const toggleStopSelection = (stopId: string) => {
    if (selectedStops.includes(stopId)) {
      setSelectedStops(selectedStops.filter(id => id !== stopId));
      const newStopOrderMap = { ...stopOrderMap };
      delete newStopOrderMap[stopId];
      const updatedStops = selectedStops
        .filter(id => id !== stopId)
        .sort((a, b) => stopOrderMap[a] - stopOrderMap[b]);
      
      updatedStops.forEach((id, index) => {
        newStopOrderMap[id] = index + 1;
      });
      
      setStopOrderMap(newStopOrderMap);
    } else {
      setSelectedStops([...selectedStops, stopId]);
      setStopOrderMap({
        ...stopOrderMap,
        [stopId]: selectedStops.length + 1
      });
    }
  };

  const moveStopUp = (stopId: string) => {
    const currentOrder = stopOrderMap[stopId];
    if (currentOrder <= 1) return;
    
    const prevStopId = selectedStops.find(id => stopOrderMap[id] === currentOrder - 1);
    if (!prevStopId) return;
    
    const newOrderMap = { ...stopOrderMap };
    newOrderMap[stopId] = currentOrder - 1;
    newOrderMap[prevStopId] = currentOrder;
    setStopOrderMap(newOrderMap);
    
    setSelectedStops([...selectedStops].sort((a, b) => newOrderMap[a] - newOrderMap[b]));
  };

  const moveStopDown = (stopId: string) => {
    const currentOrder = stopOrderMap[stopId];
    if (currentOrder >= selectedStops.length) return;
    
    const nextStopId = selectedStops.find(id => stopOrderMap[id] === currentOrder + 1);
    if (!nextStopId) return;
    
    const newOrderMap = { ...stopOrderMap };
    newOrderMap[stopId] = currentOrder + 1;
    newOrderMap[nextStopId] = currentOrder;
    setStopOrderMap(newOrderMap);
    
    setSelectedStops([...selectedStops].sort((a, b) => newOrderMap[a] - newOrderMap[b]));
  };

  const fetchRouteStopsForEdit = async (routeId: string) => {
    try {
      const { data, error } = await supabase
        .from('route_stops')
        .select('stop_id, order_number')
        .eq('route_id', routeId)
        .order('order_number');
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const stopIds = data.map(item => item.stop_id);
        setSelectedStops(stopIds);
        
        const orderMap: Record<string, number> = {};
        data.forEach(item => {
          orderMap[item.stop_id] = item.order_number;
        });
        setStopOrderMap(orderMap);
      } else {
        setSelectedStops([]);
        setStopOrderMap({});
      }
    } catch (error) {
      console.error('Error fetching route stops:', error);
      toast({
        title: "Error",
        description: "Failed to load route stops for editing.",
        variant: "destructive"
      });
    }
  };

  const prepareRouteEdit = (route: Route) => {
    setSelectedRoute(route);
    setStartPointUrl('');
    setEndPointUrl('');
    setIsEditModalOpen(true);
    fetchRouteStopsForEdit(route.id);
  };

  const getGoogleMapsUrl = (routeId: string) => {
    if (!routeStops) return '';
    
    const stopsForRoute = routeStops
      .filter(rs => rs.route_id === routeId)
      .sort((a, b) => a.order_number - b.order_number);
    
    if (stopsForRoute.length < 2) return '';
    
    const stopCoordinates = stopsForRoute.map(rs => {
      const stop = stops?.find(s => s.id === rs.stop_id);
      return stop ? { lat: stop.latitude, lng: stop.longitude } : null;
    }).filter(Boolean);
    
    if (stopCoordinates.length < 2) return '';
    
    let url = 'https://www.google.com/maps/dir/?api=1';
    
    const origin = stopCoordinates[0];
    url += `&origin=${origin?.lat},${origin?.lng}`;
    
    const destination = stopCoordinates[stopCoordinates.length - 1];
    url += `&destination=${destination?.lat},${destination?.lng}`;
    
    if (stopCoordinates.length > 2) {
      const waypoints = stopCoordinates
        .slice(1, -1)
        .map(coord => `${coord?.lat},${coord?.lng}`)
        .join('|');
      url += `&waypoints=${waypoints}`;
    }
    
    url += '&travelmode=driving';
    
    return url;
  };

  const filteredRoutes = routes?.filter((route) =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.start_point.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.end_point.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.transport_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Routes Management</h1>

      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <input
          type="text"
          placeholder="Search routes by name, start point, end point..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 rounded-md border border-border w-full md:w-2/3"
        />
        <Button
          onClick={() => {
            setIsNewRouteModalOpen(true);
            setSelectedRoute({
              id: '',
              name: '',
              start_point: '',
              end_point: '',
              cost: 0,
              transport_type: 'bus',
              notes: ''
            });
            setStartPointUrl('');
            setEndPointUrl('');
            setSelectedStops([]);
            setStopOrderMap({});
          }}
          className="w-full md:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Route
        </Button>
      </div>

      {routesLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoutes?.length === 0 ? (
            <div className="col-span-full text-center py-8">
              No routes found matching your search criteria.
            </div>
          ) : (
            filteredRoutes?.map((route) => (
              <div key={route.id} className="border border-border rounded-md overflow-hidden bg-card hover:shadow-md transition-shadow">
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{route.name}</h3>
                  <div className="space-y-2 mb-3">
                    <p className="text-sm">
                      <span className="font-medium">From:</span> {route.start_point}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">To:</span> {route.end_point}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Cost:</span> R{route.cost !== undefined && route.cost !== null ? route.cost.toFixed(2) : '0.00'}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Transport:</span> {route.transport_type}
                    </p>
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span>Completion</span>
                        <span>{routeCompletionPercentage[route.id] || 0}%</span>
                      </div>
                      <Slider
                        value={[routeCompletionPercentage[route.id] || 0]}
                        max={100}
                        step={1}
                        disabled
                        className="cursor-default mt-1"
                      />
                    </div>
                    
                    {routeStops && routeStops.some(rs => rs.route_id === route.id) && (
                      <div className="mt-2">
                        <a 
                          href={getGoogleMapsUrl(route.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center"
                        >
                          <Route className="h-3 w-3 mr-1" />
                          View route in Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {route.notes && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      <span className="font-medium">Notes:</span> {route.notes}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRouteSelect(route)}
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => prepareRouteEdit(route)}
                      className="flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedRoute(route);
                        setIsDeleteModalOpen(true);
                      }}
                      className="flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div
        className={`fixed inset-0 bg-black/50 z-50 ${isEditModalOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsEditModalOpen(false)}
      >
        <div
          className="bg-background p-6 rounded-md w-full md:w-[600px] lg:w-2/3 absolute top-0 right-0 h-full overflow-y-auto transform transition-transform duration-300"
          style={{
            transform: isEditModalOpen ? 'translateX(0)' : 'translateX(100%)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-semibold mb-6">Edit Route</h3>
          <form onSubmit={handleRouteEdit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Route Name *</label>
                <input
                  type="text"
                  value={selectedRoute?.name || ''}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute!, name: e.target.value })}
                  className="p-2 rounded-md border border-border w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Transport Type *</label>
                <select
                  value={selectedRoute?.transport_type || ''}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute!, transport_type: e.target.value })}
                  className="p-2 rounded-md border border-border w-full"
                  required
                >
                  <option value="bus">Bus</option>
                  <option value="taxi">Taxi</option>
                  <option value="train">Train</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Point (Google Maps URL)</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={startPointUrl}
                    onChange={(e) => setStartPointUrl(e.target.value)}
                    placeholder="Paste Google Maps URL for start point"
                    className="p-2 rounded-md border border-border w-full"
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => handleStartPointUrlChange(startPointUrl)}
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Start Point Name *</label>
                <input
                  type="text"
                  value={selectedRoute?.start_point || ''}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute!, start_point: e.target.value })}
                  className="p-2 rounded-md border border-border w-full"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">End Point (Google Maps URL)</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={endPointUrl}
                    onChange={(e) => setEndPointUrl(e.target.value)}
                    placeholder="Paste Google Maps URL for end point"
                    className="p-2 rounded-md border border-border w-full"
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => handleEndPointUrlChange(endPointUrl)}
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">End Point Name *</label>
                <input
                  type="text"
                  value={selectedRoute?.end_point || ''}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute!, end_point: e.target.value })}
                  className="p-2 rounded-md border border-border w-full"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cost (R) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={selectedRoute?.cost || 0}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute!, cost: parseFloat(e.target.value) })}
                  className="p-2 rounded-md border border-border w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Associated Hub</label>
                <select
                  value={selectedRoute?.hub_id || ''}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute!, hub_id: e.target.value || undefined })}
                  className="p-2 rounded-md border border-border w-full"
                >
                  <option value="">None (Independent Route)</option>
                  {hubs?.map(hub => (
                    <option key={hub.id} value={hub.id}>{hub.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={selectedRoute?.notes || ''}
                onChange={(e) => setSelectedRoute({ ...selectedRoute!, notes: e.target.value })}
                className="p-2 rounded-md border border-border w-full h-24"
                placeholder="Add any relevant notes about this route"
              />
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h4 className="text-lg font-medium mb-4">Route Stops</h4>
              
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Select and arrange the stops for this route. The order determines the sequence of stops along the route.
                </p>
                
                {selectedStops.length > 0 && (
                  <div className="border rounded-md p-4 mb-4">
                    <h5 className="font-medium mb-2">Selected Stops</h5>
                    <div className="space-y-2">
                      {selectedStops
                        .sort((a, b) => stopOrderMap[a] - stopOrderMap[b])
                        .map((stopId) => {
                          const stop = stops?.find(s => s.id === stopId);
                          return (
                            <div key={stopId} className="flex items-center justify-between p-2 bg-accent rounded-md">
                              <div className="flex items-center">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold mr-2">
                                  {stopOrderMap[stopId]}
                                </div>
                                <span>{stop?.name}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <button
                                  type="button"
                                  onClick={() => moveStopUp(stopId)}
                                  className="p-1 hover:bg-muted rounded"
                                  disabled={stopOrderMap[stopId] <= 1}
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveStopDown(stopId)}
                                  className="p-1 hover:bg-muted rounded"
                                  disabled={stopOrderMap[stopId] >= selectedStops.length}
                                >
                                  ↓
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleStopSelection(stopId)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
                
                <div className="border rounded-md p-4">
                  <h5 className="font-medium mb-2">Available Stops</h5>
                  <div className="max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {stops?.filter(stop => !selectedStops.includes(stop.id)).map((stop) => (
                        <div 
                          key={stop.id}
                          className="flex items-center p-2 bg-muted/20 hover:bg-accent rounded-md cursor-pointer"
                          onClick={() => toggleStopSelection(stop.id)}
                        >
                          <CirclePlus className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm">{stop.name}</span>
                        </div>
                      ))}
                      {stops?.filter(stop => !selectedStops.includes(stop.id)).length === 0 && (
                        <p className="text-sm text-muted-foreground col-span-2 p-2">No more stops available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateRoute.isPending}
              >
                {updateRoute.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/50 z-50 ${isNewRouteModalOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsNewRouteModalOpen(false)}
      >
        <div
          className="bg-background p-6 rounded-md w-full md:w-[600px] lg:w-2/3 absolute top-0 right-0 h-full overflow-y-auto transform transition-transform duration-300"
          style={{
            transform: isNewRouteModalOpen ? 'translateX(0)' : 'translateX(100%)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-semibold mb-6">Add New Route</h3>
          <form onSubmit={handleNewRoute} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Route Name *</label>
                <input
                  type="text"
                  value={selectedRoute?.name || ''}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute!, name: e.target.value })}
                  className="p-2 rounded-md border border-border w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Transport Type *</label>
                <select
                  value={selectedRoute?.transport_type || 'bus'}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute!, transport_type: e.target.value })}
                  className="p-2 rounded-md border border-border w-full"
                  required
                >
                  <option value="bus">Bus</option>
                  <option value="taxi">Taxi</option>
                  <option value="train">Train</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Point (Google Maps URL)</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={startPointUrl}
                    onChange={(e) => setStartPointUrl(e.target.value)}
                    placeholder="Paste Google Maps URL for start point"
                    className="p-2 rounded-md border border-border w-full"
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => handleStartPointUrlChange(startPointUrl)}
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Start Point Name *</label>
                <input
                  type="text"
                  value={selectedRoute?.start_point || ''}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute!, start_point: e.target.value })}
                  className="p-2 rounded-md border border-border w-full"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">End Point (Google Maps URL)</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={endPointUrl}
                    onChange={(e) => setEndPointUrl(e.target.value)}
                    placeholder="Paste Google Maps URL for end point"
                    className="p-2 rounded-md border border-border w-full"
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => handleEndPointUrlChange(endPointUrl)}
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">End Point Name *</label>
                <input
                  type="text"
                  value={selectedRoute?.end_point || ''}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute!, end_point: e.target.value })}
                  className="p-2 rounded-md border border-border w-full"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cost (R) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={selectedRoute?.cost || 0}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute!, cost: parseFloat(e.target.value) })}
                  className="p-2 rounded-md border border-border w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Associated Hub</label>
                <select
                  value={selectedRoute?.hub_id || ''}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute!, hub_id: e.target.value || undefined })}
                  className="p-2 rounded-md border border-border w-full"
                >
                  <option value="">None (Independent Route)</option>
                  {hubs?.map(hub => (
                    <option key={hub.id} value={hub.id}>{hub.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={selectedRoute?.notes || ''}
                onChange={(e) => setSelectedRoute({ ...selectedRoute!, notes: e.target.value })}
                className="p-2 rounded-md border border-border w-full h-24"
                placeholder="Add any relevant notes about this route"
              />
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h4 className="text-lg font-medium mb-4">Route Stops</h4>
              
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Select and arrange the stops for this route. The order determines the sequence of stops along the route.
                </p>
                
                {selectedStops.length > 0 && (
                  <div className="border rounded-md p-4 mb-4">
                    <h5 className="font-medium mb-2">Selected Stops</h5>
                    <div className="space-y-2">
                      {selectedStops
                        .sort((a, b) => stopOrderMap[a] - stopOrderMap[b])
                        .map((stopId) => {
                          const stop = stops?.find(s => s.id === stopId);
                          return (
                            <div key={stopId} className="flex items-center justify-between p-2 bg-accent rounded-md">
                              <div className="flex items-center">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold mr-2">
                                  {stopOrderMap[stopId]}
                                </div>
                                <span>{stop?.name}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <button
                                  type="button"
                                  onClick={() => moveStopUp(stopId)}
                                  className="p-1 hover:bg-muted rounded"
                                  disabled={stopOrderMap[stopId] <= 1}
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveStopDown(stopId)}
                                  className="p-1 hover:bg-muted rounded"
                                  disabled={stopOrderMap[stopId] >= selectedStops.length}
                                >
                                  ↓
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleStopSelection(stopId)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
                
                <div className="border rounded-md p-4">
                  <h5 className="font-medium mb-2">Available Stops</h5>
                  <div className="max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {stops?.filter(stop => !selectedStops.includes(stop.id)).map((stop) => (
                        <div 
                          key={stop.id}
                          className="flex items-center p-2 bg-muted/20 hover:bg-accent rounded-md cursor-pointer"
                          onClick={() => toggleStopSelection(stop.id)}
                        >
                          <CirclePlus className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm">{stop.name}</span>
                        </div>
                      ))}
                      {stops?.filter(stop => !selectedStops.includes(stop.id)).length === 0 && (
                        <p className="text-sm text-muted-foreground col-span-2 p-2">No more stops available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsNewRouteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={addNewRoute.isPending}
              >
                {addNewRoute.isPending ? 'Adding...' : 'Add Route'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {selectedRoute && (
        <div
          className={`fixed inset-0 bg-black/50 z-50 ${isDeleteModalOpen ? 'block' : 'hidden'}`}
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-background p-6 rounded-md max-w-md mx-auto mt-[20vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Delete Route</h3>
            <p className="mb-2">
              Are you sure you want to delete "{selectedRoute.name}"?
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              This action cannot be undone and will remove all associated stops from this route.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteRoute.mutate(selectedRoute.id)}
                disabled={deleteRoute.isPending}
              >
                {deleteRoute.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutesPage;
