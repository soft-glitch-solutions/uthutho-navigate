
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, Map, Route, Building } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { parseGoogleMapsUrl } from '@/utils/googleMaps';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  cost: number | null;
  created_at: string;
  updated_at: string;
  image_url: string | null;
  notes: string | null;
}

interface Route {
  id: string;
  name: string;
}

interface Hub {
  id: string;
  name: string;
}

interface RouteStop {
  route_id: string;
  stop_id: string;
  order_number: number;
}

interface HubStop {
  hub_id: string;
  stop_id: string;
  distance_meters: number | null;
}

const StopsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewStopModalOpen, setIsNewStopModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [selectedHubs, setSelectedHubs] = useState<string[]>([]);
  const [routeOrderNumbers, setRouteOrderNumbers] = useState<Record<string, number>>({});
  const [hubDistances, setHubDistances] = useState<Record<string, number>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch stops from the database
  const { data: stops, isLoading: stopsLoading } = useQuery({
    queryKey: ['stops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stops')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Stop[];
    },
  });

  // Fetch routes for dropdown selection
  const { data: routes } = useQuery({
    queryKey: ['routes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routes')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data as Route[];
    },
  });

  // Fetch hubs for dropdown selection
  const { data: hubs } = useQuery({
    queryKey: ['hubs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hubs')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data as Hub[];
    },
  });

  // Fetch route_stops for a specific stop
  const fetchRouteStopsForStop = async (stopId: string) => {
    const { data, error } = await supabase
      .from('route_stops')
      .select('route_id, order_number')
      .eq('stop_id', stopId);
    
    if (error) throw error;
    return data as RouteStop[];
  };

  // Fetch hub_stops for a specific stop
  const fetchHubStopsForStop = async (stopId: string) => {
    try {
      // Instead of querying an actual hub_stops table that doesn't exist yet, 
      // we can return an empty array during development
      return [] as { hub_id: string, distance_meters: number | null }[];
    } catch (error) {
      console.error("Error fetching hub stops:", error);
      return [];
    }
  };

  // Filter stops based on search query
  const filteredStops = stops?.filter((stop) =>
    stop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mutation for updating a stop
  const updateStop = useMutation({
    mutationFn: async (updatedStop: Stop) => {
      // Update the stop
      const { error } = await supabase
        .from('stops')
        .update({
          name: updatedStop.name,
          latitude: updatedStop.latitude,
          longitude: updatedStop.longitude,
          cost: updatedStop.cost,
          notes: updatedStop.notes
        })
        .eq('id', updatedStop.id);
      
      if (error) throw error;

      // Update route associations
      // First, delete all existing route_stops for this stop
      const { error: deleteRouteStopsError } = await supabase
        .from('route_stops')
        .delete()
        .eq('stop_id', updatedStop.id);
      
      if (deleteRouteStopsError) throw deleteRouteStopsError;

      // Then insert new route_stops
      if (selectedRoutes.length > 0) {
        const routeStopsToInsert = selectedRoutes.map(routeId => ({
          route_id: routeId,
          stop_id: updatedStop.id,
          order_number: routeOrderNumbers[routeId] || 1
        }));

        const { error: insertRouteStopsError } = await supabase
          .from('route_stops')
          .insert(routeStopsToInsert);
        
        if (insertRouteStopsError) throw insertRouteStopsError;
      }

      // Update hub associations
      // First, delete all existing hub_stops for this stop
      const { error: deleteHubStopsError } = await supabase
        .from('hub_stops')
        .delete()
        .eq('stop_id', updatedStop.id);
      
      if (deleteHubStopsError) throw deleteHubStopsError;

      // Then insert new hub_stops
      if (selectedHubs.length > 0) {
        const hubStopsToInsert = selectedHubs.map(hubId => ({
          hub_id: hubId,
          stop_id: updatedStop.id,
          distance_meters: hubDistances[hubId] || null
        }));

        const { error: insertHubStopsError } = await supabase
          .from('hub_stops')
          .insert(hubStopsToInsert);
        
        if (insertHubStopsError) throw insertHubStopsError;
      }

      return updatedStop;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stops'] });
      setIsEditModalOpen(false);
      toast({
        title: "Stop updated",
        description: "The stop has been successfully updated."
      });
    },
  });

  // Mutation for adding a new stop
  const addNewStop = useMutation({
    mutationFn: async (newStop: Omit<Stop, 'id' | 'created_at' | 'updated_at'>) => {
      // Insert the new stop
      const { data, error } = await supabase
        .from('stops')
        .insert([newStop])
        .select()
        .single();
      
      if (error) throw error;

      // Insert route associations
      if (selectedRoutes.length > 0) {
        const routeStopsToInsert = selectedRoutes.map(routeId => ({
          route_id: routeId,
          stop_id: data.id,
          order_number: routeOrderNumbers[routeId] || 1
        }));

        const { error: insertRouteStopsError } = await supabase
          .from('route_stops')
          .insert(routeStopsToInsert);
        
        if (insertRouteStopsError) throw insertRouteStopsError;
      }

      // Insert hub associations
      if (selectedHubs.length > 0) {
        const hubStopsToInsert = selectedHubs.map(hubId => ({
          hub_id: hubId,
          stop_id: data.id,
          distance_meters: hubDistances[hubId] || null
        }));

        const { error: insertHubStopsError } = await supabase
          .from('hub_stops')
          .insert(hubStopsToInsert);
        
        if (insertHubStopsError) throw insertHubStopsError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stops'] });
      setIsNewStopModalOpen(false);
      setGoogleMapsUrl('');
      setSelectedRoutes([]);
      setSelectedHubs([]);
      setRouteOrderNumbers({});
      setHubDistances({});
      toast({
        title: "Stop created",
        description: "The new stop has been successfully created."
      });
    },
  });

  // Mutation for deleting a stop
  const deleteStop = useMutation({
    mutationFn: async (stopId: string) => {
      // Delete route_stops and hub_stops first
      await supabase.from('route_stops').delete().eq('stop_id', stopId);
      await supabase.from('hub_stops').delete().eq('stop_id', stopId);
      
      // Then delete the stop
      const { error } = await supabase
        .from('stops')
        .delete()
        .eq('id', stopId);
      
      if (error) throw error;
      return stopId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stops'] });
      setIsDeleteModalOpen(false);
      toast({
        title: "Stop deleted",
        description: "The stop has been successfully deleted."
      });
    },
  });

  // Handle Google Maps URL parsing
  const handleGoogleMapsUrlChange = (url: string) => {
    setGoogleMapsUrl(url);
    const { latitude, longitude } = parseGoogleMapsUrl(url);
    
    if (latitude && longitude) {
      if (selectedStop) {
        setSelectedStop({
          ...selectedStop,
          latitude,
          longitude
        });
      } else {
        setSelectedStop({
          id: '',
          name: '',
          latitude,
          longitude,
          cost: 0,
          created_at: '',
          updated_at: '',
          image_url: null,
          notes: null
        });
      }
      toast({
        title: "Coordinates Extracted",
        description: `Latitude: ${latitude}, Longitude: ${longitude}`,
      });
    } else {
      toast({
        title: "Warning",
        description: "Could not extract coordinates from the URL. Please check the format.",
        variant: "destructive",
      });
    }
  };

  // Handle form submission for updating a stop
  const handleStopEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStop) {
      updateStop.mutate(selectedStop);
    }
  };

  // Handle form submission for adding a new stop
  const handleNewStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStop) {
      const newStop = {
        name: selectedStop.name,
        latitude: selectedStop.latitude,
        longitude: selectedStop.longitude,
        cost: selectedStop.cost,
        image_url: selectedStop.image_url,
        notes: selectedStop.notes
      };
      addNewStop.mutate(newStop);
    } else {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
    }
  };

  // Toggle route selection
  const toggleRouteSelection = (routeId: string) => {
    if (selectedRoutes.includes(routeId)) {
      setSelectedRoutes(selectedRoutes.filter(id => id !== routeId));
    } else {
      setSelectedRoutes([...selectedRoutes, routeId]);
    }
  };

  // Toggle hub selection
  const toggleHubSelection = (hubId: string) => {
    if (selectedHubs.includes(hubId)) {
      setSelectedHubs(selectedHubs.filter(id => id !== hubId));
    } else {
      setSelectedHubs([...selectedHubs, hubId]);
    }
  };

  // Handle editing a stop
  const handleEditStop = async (stop: Stop) => {
    try {
      setSelectedStop(stop);
      setGoogleMapsUrl('');
      
      // Fetch and set routes
      const routeStops = await fetchRouteStopsForStop(stop.id);
      const routeIds = routeStops.map(rs => rs.route_id);
      setSelectedRoutes(routeIds);
      
      // Set route order numbers
      const orderNumbers: Record<string, number> = {};
      routeStops.forEach(rs => {
        orderNumbers[rs.route_id] = rs.order_number;
      });
      setRouteOrderNumbers(orderNumbers);
      
      // Fetch and set hubs
      const hubStops = await fetchHubStopsForStop(stop.id);
      const hubIds = hubStops.map(hs => hs.hub_id);
      setSelectedHubs(hubIds);
      
      // Set hub distances
      const distances: Record<string, number> = {};
      hubStops.forEach(hs => {
        if (hs.distance_meters) {
          distances[hs.hub_id] = hs.distance_meters;
        }
      });
      setHubDistances(distances);
      
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Error setting up stop edit:", error);
      toast({
        title: "Error",
        description: "Failed to load stop relationships.",
        variant: "destructive"
      });
    }
  };

  const getRoutesForStop = (stopId: string) => {
    // This would be implemented to show routes on the main list
    return [];
  };

  const getHubsForStop = (stopId: string) => {
    // This would be implemented to show hubs on the main list
    return [];
  };

  return (
    <div className="p-8">
      {/* Search Input and Add Button */}
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search Stops"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 rounded-md border border-border w-full"
        />
        <Button
          onClick={() => {
            setSelectedStop({
              id: '',
              name: '',
              latitude: 0,
              longitude: 0,
              cost: 0,
              created_at: '',
              updated_at: '',
              image_url: null,
              notes: null
            });
            setSelectedRoutes([]);
            setSelectedHubs([]);
            setRouteOrderNumbers({});
            setHubDistances({});
            setIsNewStopModalOpen(true);
          }}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Stop
        </Button>
      </div>

      {/* Stops List */}
      <div className="space-y-4">
        {stopsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : filteredStops?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No stops found</div>
        ) : (
          filteredStops?.map((stop) => (
            <Card key={stop.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{stop.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Coordinates</p>
                    <p className="text-sm">{stop.latitude}, {stop.longitude}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cost</p>
                    <p className="text-sm">{stop.cost ? `R${stop.cost}` : 'Free'}</p>
                  </div>
                </div>
                
                {stop.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{stop.notes}</p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {getRoutesForStop(stop.id).map(route => (
                    <Badge key={route.id} className="flex items-center gap-1 bg-blue-100 text-blue-800">
                      <Route className="h-3 w-3" />
                      {route.name}
                    </Badge>
                  ))}
                  
                  {getHubsForStop(stop.id).map(hub => (
                    <Badge key={hub.id} className="flex items-center gap-1 bg-amber-100 text-amber-800">
                      <Building className="h-3 w-3" />
                      {hub.name}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleEditStop(stop)}
                    className="flex items-center"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSelectedStop(stop);
                      setIsDeleteModalOpen(true);
                    }}
                    className="flex items-center"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Stop Modal */}
      <div
        className={`fixed inset-0 bg-black/50 ${isEditModalOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsEditModalOpen(false)}
      >
        <div
          className="bg-background p-6 rounded-md w-full md:w-[700px] mx-auto mt-20 max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold mb-4">Edit Stop</h3>
          <form onSubmit={handleStopEdit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={selectedStop?.name || ''}
                  onChange={(e) => setSelectedStop({ ...selectedStop!, name: e.target.value })}
                  className="w-full p-2 border border-border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Google Maps URL</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    className="w-full p-2 border border-border rounded-md"
                    placeholder="Paste Google Maps URL here"
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => handleGoogleMapsUrlChange(googleMapsUrl)}
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Paste a Google Maps URL to automatically extract coordinates
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={selectedStop?.latitude || 0}
                    onChange={(e) => setSelectedStop({ ...selectedStop!, latitude: parseFloat(e.target.value) })}
                    className="w-full p-2 border border-border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={selectedStop?.longitude || 0}
                    onChange={(e) => setSelectedStop({ ...selectedStop!, longitude: parseFloat(e.target.value) })}
                    className="w-full p-2 border border-border rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Cost (R)</label>
                <input
                  type="number"
                  step="0.01"
                  value={selectedStop?.cost || 0}
                  onChange={(e) => setSelectedStop({ ...selectedStop!, cost: parseFloat(e.target.value) })}
                  className="w-full p-2 border border-border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={selectedStop?.notes || ''}
                  onChange={(e) => setSelectedStop({ ...selectedStop!, notes: e.target.value })}
                  className="w-full p-2 border border-border rounded-md"
                  rows={3}
                  placeholder="Add any notes or details about this stop"
                />
              </div>
              
              <Tabs defaultValue="routes">
                <TabsList className="w-full">
                  <TabsTrigger value="routes" className="flex-1">Associated Routes</TabsTrigger>
                  <TabsTrigger value="hubs" className="flex-1">Associated Hubs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="routes">
                  <div className="space-y-2 p-2">
                    <p className="text-sm font-medium">Select routes for this stop:</p>
                    <div className="max-h-60 overflow-y-auto border border-border rounded-md p-2">
                      {routes?.map(route => (
                        <div key={route.id} className="border-b border-border py-2 px-1 last:border-0">
                          <label className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedRoutes.includes(route.id)}
                                onChange={() => toggleRouteSelection(route.id)}
                                className="mr-2"
                              />
                              <span>{route.name}</span>
                            </div>
                            {selectedRoutes.includes(route.id) && (
                              <div className="flex items-center">
                                <span className="text-xs mr-2">Order:</span>
                                <input
                                  type="number"
                                  min="1"
                                  value={routeOrderNumbers[route.id] || 1}
                                  onChange={(e) => {
                                    const newOrderNumbers = { ...routeOrderNumbers };
                                    newOrderNumbers[route.id] = parseInt(e.target.value);
                                    setRouteOrderNumbers(newOrderNumbers);
                                  }}
                                  className="w-16 p-1 border border-border rounded-md"
                                />
                              </div>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="hubs">
                  <div className="space-y-2 p-2">
                    <p className="text-sm font-medium">Select hubs for this stop:</p>
                    <div className="max-h-60 overflow-y-auto border border-border rounded-md p-2">
                      {hubs?.map(hub => (
                        <div key={hub.id} className="border-b border-border py-2 px-1 last:border-0">
                          <label className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedHubs.includes(hub.id)}
                                onChange={() => toggleHubSelection(hub.id)}
                                className="mr-2"
                              />
                              <span>{hub.name}</span>
                            </div>
                            {selectedHubs.includes(hub.id) && (
                              <div className="flex items-center">
                                <span className="text-xs mr-2">Distance (m):</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={hubDistances[hub.id] || 0}
                                  onChange={(e) => {
                                    const newDistances = { ...hubDistances };
                                    newDistances[hub.id] = parseInt(e.target.value);
                                    setHubDistances(newDistances);
                                  }}
                                  className="w-20 p-1 border border-border rounded-md"
                                />
                              </div>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>
      </div>

      {/* New Stop Modal */}
      <div
        className={`fixed inset-0 bg-black/50 ${isNewStopModalOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsNewStopModalOpen(false)}
      >
        <div
          className="bg-background p-6 rounded-md w-full md:w-[700px] mx-auto mt-20 max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold mb-4">Add New Stop</h3>
          <form onSubmit={handleNewStop}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={selectedStop?.name || ''}
                  onChange={(e) => setSelectedStop({ ...selectedStop!, name: e.target.value })}
                  className="w-full p-2 border border-border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Google Maps URL</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    className="w-full p-2 border border-border rounded-md"
                    placeholder="Paste Google Maps URL here"
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => handleGoogleMapsUrlChange(googleMapsUrl)}
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Paste a Google Maps URL to automatically extract coordinates
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={selectedStop?.latitude || 0}
                    onChange={(e) => setSelectedStop({ ...selectedStop!, latitude: parseFloat(e.target.value) })}
                    className="w-full p-2 border border-border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={selectedStop?.longitude || 0}
                    onChange={(e) => setSelectedStop({ ...selectedStop!, longitude: parseFloat(e.target.value) })}
                    className="w-full p-2 border border-border rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Cost (R)</label>
                <input
                  type="number"
                  step="0.01"
                  value={selectedStop?.cost || 0}
                  onChange={(e) => setSelectedStop({ ...selectedStop!, cost: parseFloat(e.target.value) })}
                  className="w-full p-2 border border-border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={selectedStop?.notes || ''}
                  onChange={(e) => setSelectedStop({ ...selectedStop!, notes: e.target.value })}
                  className="w-full p-2 border border-border rounded-md"
                  rows={3}
                  placeholder="Add any notes or details about this stop"
                />
              </div>
              
              <Tabs defaultValue="routes">
                <TabsList className="w-full">
                  <TabsTrigger value="routes" className="flex-1">Associated Routes</TabsTrigger>
                  <TabsTrigger value="hubs" className="flex-1">Associated Hubs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="routes">
                  <div className="space-y-2 p-2">
                    <p className="text-sm font-medium">Select routes for this stop:</p>
                    <div className="max-h-60 overflow-y-auto border border-border rounded-md p-2">
                      {routes?.map(route => (
                        <div key={route.id} className="border-b border-border py-2 px-1 last:border-0">
                          <label className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedRoutes.includes(route.id)}
                                onChange={() => toggleRouteSelection(route.id)}
                                className="mr-2"
                              />
                              <span>{route.name}</span>
                            </div>
                            {selectedRoutes.includes(route.id) && (
                              <div className="flex items-center">
                                <span className="text-xs mr-2">Order:</span>
                                <input
                                  type="number"
                                  min="1"
                                  value={routeOrderNumbers[route.id] || 1}
                                  onChange={(e) => {
                                    const newOrderNumbers = { ...routeOrderNumbers };
                                    newOrderNumbers[route.id] = parseInt(e.target.value);
                                    setRouteOrderNumbers(newOrderNumbers);
                                  }}
                                  className="w-16 p-1 border border-border rounded-md"
                                />
                              </div>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="hubs">
                  <div className="space-y-2 p-2">
                    <p className="text-sm font-medium">Select hubs for this stop:</p>
                    <div className="max-h-60 overflow-y-auto border border-border rounded-md p-2">
                      {hubs?.map(hub => (
                        <div key={hub.id} className="border-b border-border py-2 px-1 last:border-0">
                          <label className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedHubs.includes(hub.id)}
                                onChange={() => toggleHubSelection(hub.id)}
                                className="mr-2"
                              />
                              <span>{hub.name}</span>
                            </div>
                            {selectedHubs.includes(hub.id) && (
                              <div className="flex items-center">
                                <span className="text-xs mr-2">Distance (m):</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={hubDistances[hub.id] || 0}
                                  onChange={(e) => {
                                    const newDistances = { ...hubDistances };
                                    newDistances[hub.id] = parseInt(e.target.value);
                                    setHubDistances(newDistances);
                                  }}
                                  className="w-20 p-1 border border-border rounded-md"
                                />
                              </div>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsNewStopModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Stop</Button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {selectedStop && (
        <div
          className={`fixed inset-0 bg-black/50 ${isDeleteModalOpen ? 'block' : 'hidden'}`}
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-background p-6 rounded-md w-full md:w-[500px] mx-auto mt-20"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete the stop "{selectedStop.name}"?</p>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              This action cannot be undone. All associated route and hub relationships will also be deleted.
            </p>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="destructive"
                onClick={() => deleteStop.mutate(selectedStop.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StopsPage;
