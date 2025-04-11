
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Stop, Route, Hub, RouteStop, HubStop } from '@/types/stops';
import { useToast } from '@/components/ui/use-toast';
import { parseGoogleMapsUrl } from '@/utils/googleMaps';

export const useStopsData = () => {
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

  // Function to create a new empty stop
  const createEmptyStop = () => {
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
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedStop,
    setSelectedStop,
    isEditModalOpen,
    setIsEditModalOpen,
    isNewStopModalOpen,
    setIsNewStopModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    googleMapsUrl,
    setGoogleMapsUrl,
    selectedRoutes,
    selectedHubs,
    routeOrderNumbers,
    setRouteOrderNumbers,
    hubDistances,
    setHubDistances,
    stops,
    filteredStops,
    stopsLoading,
    routes,
    hubs,
    handleGoogleMapsUrlChange,
    handleStopEdit,
    handleNewStop,
    toggleRouteSelection,
    toggleHubSelection,
    handleEditStop,
    getRoutesForStop,
    getHubsForStop,
    deleteStop,
    createEmptyStop
  };
};
