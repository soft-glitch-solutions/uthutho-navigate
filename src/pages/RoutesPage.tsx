import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';

interface Route {
  id: string;
  name: string;
  start_point: string;
  end_point: string;
  cost: number;
  transport_type: string;
  hub_id?: string;
}

const RoutesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewRouteModalOpen, setIsNewRouteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch routes
  const { data: routes, isLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('routes').select('*');
      if (error) throw error;
      return data as Route[];
    },
  });

  // Filter routes based on search query
  const filteredRoutes = routes?.filter((route) =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update route mutation
  const updateRoute = useMutation({
    mutationFn: async (updatedRoute: Route) => {
      const { error } = await supabase
        .from('routes')
        .update(updatedRoute)
        .eq('id', updatedRoute.id);
      if (error) throw error;
      return updatedRoute;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      setIsEditModalOpen(false);
    },
  });

  // Add new route mutation
  const addNewRoute = useMutation({
    mutationFn: async (newRoute: Route) => {
      const { error } = await supabase.from('routes').insert([newRoute]);
      if (error) throw error;
      return newRoute;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      setIsNewRouteModalOpen(false);
    },
  });

  // Delete route mutation
  const deleteRoute = useMutation({
    mutationFn: async (routeId: string) => {
      const { error } = await supabase.from('routes').delete().eq('id', routeId);
      if (error) throw error;
      return routeId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      setIsDeleteModalOpen(false);
    },
  });

  // Handle form submission for editing a route
  const handleRouteEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoute) {
      updateRoute.mutate(selectedRoute);
    }
  };

  // Handle form submission for adding a new route
  const handleNewRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoute) {
      const newRoute: Route = {
        id: Math.random().toString(36).substr(2, 9),
        name: selectedRoute.name,
        start_point: selectedRoute.start_point,
        end_point: selectedRoute.end_point,
        cost: selectedRoute.cost,
        transport_type: selectedRoute.transport_type,
        hub_id: selectedRoute.hub_id
      };
      addNewRoute.mutate(newRoute);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Routes Management</h1>

      <div className="flex items-center space-x-4 mb-6">
        <input
          type="text"
          placeholder="Search routes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 rounded-md border border-border w-full"
        />
        <Button
          onClick={() => {
            setIsNewRouteModalOpen(true);
            setSelectedRoute(null);
          }}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Route
        </Button>
      </div>

      {isLoading ? (
        <div>Loading routes...</div>
      ) : (
        <div className="space-y-4">
          {filteredRoutes?.map((route) => (
            <div key={route.id} className="flex justify-between items-center p-4 border border-border rounded-md">
              <div>
                <h3 className="font-semibold">{route.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {route.start_point} to {route.end_point} | R{route.cost} | {route.transport_type}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    setSelectedRoute(route);
                    setIsEditModalOpen(true);
                  }}
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setSelectedRoute(route);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Route Modal */}
      {selectedRoute && (
        <div
          className={`fixed inset-0 bg-gray-800 bg-opacity-50 ${isEditModalOpen ? 'block' : 'hidden'}`}
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-md w-1/3 absolute top-0 right-0 h-full transform transition-transform duration-300"
            style={{
              transform: isEditModalOpen ? 'translateX(0)' : 'translateX(100%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Edit Route</h3>
            <form onSubmit={handleRouteEdit}>
              <div className="mb-4">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={selectedRoute.name}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute, name: e.target.value })}
                  className="p-2 rounded-md border border-border w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Start Point</label>
                <input
                  type="text"
                  value={selectedRoute.start_point}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute, start_point: e.target.value })}
                  className="p-2 rounded-md border border-border w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">End Point</label>
                <input
                  type="text"
                  value={selectedRoute.end_point}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute, end_point: e.target.value })}
                  className="p-2 rounded-md border border-border w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Cost</label>
                <input
                  type="number"
                  value={selectedRoute.cost}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute, cost: Number(e.target.value) })}
                  className="p-2 rounded-md border border-border w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Transport Type</label>
                <select
                  value={selectedRoute.transport_type}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute, transport_type: e.target.value })}
                  className="p-2 rounded-md border border-border w-full"
                >
                  <option value="bus">Bus</option>
                  <option value="taxi">Taxi</option>
                  <option value="train">Train</option>
                </select>
              </div>
              <Button type="submit" className="mt-4 w-full">Save Changes</Button>
            </form>
          </div>
        </div>
      )}

      {/* New Route Modal */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-50 ${isNewRouteModalOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsNewRouteModalOpen(false)}
      >
        <div
          className="bg-white p-6 rounded-md w-1/3 absolute top-0 right-0 h-full transform transition-transform duration-300"
          style={{
            transform: isNewRouteModalOpen ? 'translateX(0)' : 'translateX(100%)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold mb-4">Add New Route</h3>
          <form onSubmit={handleNewRoute}>
            <div className="mb-4">
              <label className="block mb-1">Name</label>
              <input
                type="text"
                value={selectedRoute?.name || ''}
                onChange={(e) => setSelectedRoute({ ...selectedRoute || {} as Route, name: e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Start Point</label>
              <input
                type="text"
                value={selectedRoute?.start_point || ''}
                onChange={(e) => setSelectedRoute({ ...selectedRoute || {} as Route, start_point: e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">End Point</label>
              <input
                type="text"
                value={selectedRoute?.end_point || ''}
                onChange={(e) => setSelectedRoute({ ...selectedRoute || {} as Route, end_point: e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Cost</label>
              <input
                type="number"
                value={selectedRoute?.cost || ''}
                onChange={(e) => setSelectedRoute({ ...selectedRoute || {} as Route, cost: Number(e.target.value) })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Transport Type</label>
              <select
                value={selectedRoute?.transport_type || 'bus'}
                onChange={(e) => setSelectedRoute({ ...selectedRoute || {} as Route, transport_type: e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              >
                <option value="bus">Bus</option>
                <option value="taxi">Taxi</option>
                <option value="train">Train</option>
              </select>
            </div>
            <Button type="submit" className="mt-4 w-full">Add Route</Button>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {selectedRoute && (
        <div
          className={`fixed inset-0 bg-gray-800 bg-opacity-50 ${isDeleteModalOpen ? 'block' : 'hidden'}`}
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-md w-1/3 absolute top-1/4 left-1/3"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this route?</h3>
            <p className="mb-4">This action cannot be undone.</p>
            <div className="flex space-x-4">
              <Button
                variant="destructive"
                onClick={() => deleteRoute.mutate(selectedRoute.id)}
              >
                Yes, Delete
              </Button>
              <Button
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutesPage;
