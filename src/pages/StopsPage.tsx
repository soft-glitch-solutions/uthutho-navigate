
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  route_id: string;
  order_number: number;
  cost: number | null;
  created_at: string;
  updated_at: string;
  image_url: string | null;
}

interface Route {
  id: string;
  name: string;
}

const StopsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewStopModalOpen, setIsNewStopModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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

  // Filter stops based on search query
  const filteredStops = stops?.filter((stop) =>
    stop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mutation for updating a stop
  const updateStop = useMutation({
    mutationFn: async (updatedStop: Stop) => {
      const { error } = await supabase
        .from('stops')
        .update({
          name: updatedStop.name,
          latitude: updatedStop.latitude,
          longitude: updatedStop.longitude,
          route_id: updatedStop.route_id,
          cost: updatedStop.cost,
          order_number: updatedStop.order_number
        })
        .eq('id', updatedStop.id);
      
      if (error) throw error;
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
    mutationFn: async (newStop: Omit<Stop, 'id' | 'created_at' | 'updated_at' | 'image_url'>) => {
      const { data, error } = await supabase
        .from('stops')
        .insert([newStop])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stops'] });
      setIsNewStopModalOpen(false);
      toast({
        title: "Stop created",
        description: "The new stop has been successfully created."
      });
    },
  });

  // Mutation for deleting a stop
  const deleteStop = useMutation({
    mutationFn: async (stopId: string) => {
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
    if (selectedStop && selectedStop.route_id) {
      const newStop = {
        name: selectedStop.name,
        latitude: selectedStop.latitude,
        longitude: selectedStop.longitude,
        route_id: selectedStop.route_id,
        order_number: selectedStop.order_number || 1,
        cost: selectedStop.cost
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

  const getRouteName = (routeId: string) => {
    const route = routes?.find(r => r.id === routeId);
    return route ? route.name : 'Unknown Route';
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
              route_id: routes?.[0]?.id || '',
              order_number: 1,
              cost: 0,
              created_at: '',
              updated_at: '',
              image_url: null
            });
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
          <div>Loading stops...</div>
        ) : filteredStops?.length === 0 ? (
          <div>No stops found</div>
        ) : (
          filteredStops?.map((stop) => (
            <div key={stop.id} className="flex justify-between items-center p-4 border border-border rounded-md">
              <div>
                <h4 className="font-semibold">{stop.name}</h4>
                <p className="text-sm text-muted-foreground">Route: {getRouteName(stop.route_id)}</p>
                <p className="text-sm text-muted-foreground">
                  Position: Order {stop.order_number} · Cost: {stop.cost ? `R${stop.cost}` : 'Free'}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    setSelectedStop(stop);
                    setIsEditModalOpen(true);
                  }}
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
            </div>
          ))
        )}
      </div>

      {/* Edit Stop Modal */}
      <div
        className={`fixed inset-0 bg-black/50 ${isEditModalOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsEditModalOpen(false)}
      >
        <div
          className="bg-background p-6 rounded-md max-w-md mx-auto mt-20"
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
                <label className="block text-sm font-medium mb-1">Route</label>
                <select
                  value={selectedStop?.route_id || ''}
                  onChange={(e) => setSelectedStop({ ...selectedStop!, route_id: e.target.value })}
                  className="w-full p-2 border border-border rounded-md"
                  required
                >
                  <option value="">Select a route</option>
                  {routes?.map(route => (
                    <option key={route.id} value={route.id}>{route.name}</option>
                  ))}
                </select>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Order Number</label>
                  <input
                    type="number"
                    value={selectedStop?.order_number || 1}
                    onChange={(e) => setSelectedStop({ ...selectedStop!, order_number: parseInt(e.target.value) })}
                    className="w-full p-2 border border-border rounded-md"
                    required
                    min="1"
                  />
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
              </div>
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
          className="bg-background p-6 rounded-md max-w-md mx-auto mt-20"
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
                <label className="block text-sm font-medium mb-1">Route</label>
                <select
                  value={selectedStop?.route_id || ''}
                  onChange={(e) => setSelectedStop({ ...selectedStop!, route_id: e.target.value })}
                  className="w-full p-2 border border-border rounded-md"
                  required
                >
                  <option value="">Select a route</option>
                  {routes?.map(route => (
                    <option key={route.id} value={route.id}>{route.name}</option>
                  ))}
                </select>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Order Number</label>
                  <input
                    type="number"
                    value={selectedStop?.order_number || 1}
                    onChange={(e) => setSelectedStop({ ...selectedStop!, order_number: parseInt(e.target.value) })}
                    className="w-full p-2 border border-border rounded-md"
                    required
                    min="1"
                  />
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
              </div>
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
            className="bg-background p-6 rounded-md max-w-md mx-auto mt-20"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Delete Stop</h3>
            <p>Are you sure you want to delete "{selectedStop.name}"?</p>
            <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={() => deleteStop.mutate(selectedStop.id)}>
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
