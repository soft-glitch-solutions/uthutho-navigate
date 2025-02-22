import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface Route {
  id: string;
  start_point: string;
  end_point: string;
  hub_id: string;
  cost: number;
}

const RoutesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewRouteModalOpen, setIsNewRouteModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch routes from the database
  const { data: routes, isLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('routes').select('*');
      if (error) throw error;
      return data;
    },
  });

  // Filter routes based on search query
  const filteredRoutes = routes?.filter((route) =>
    route.start_point.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.end_point.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mutation for updating a route
  const updateRoute = useMutation({
    mutationFn: async (updatedRoute: Route) => {
      const { error } = await supabase.from('routes').update(updatedRoute).eq('id', updatedRoute.id);
      if (error) throw error;
      return updatedRoute;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['routes']);
      setIsEditModalOpen(false);
    },
  });

  // Mutation for adding a new route
  const addNewRoute = useMutation({
    mutationFn: async (newRoute: Route) => {
      const { error } = await supabase.from('routes').insert([newRoute]);
      if (error) throw error;
      return newRoute;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['routes']);
      setIsNewRouteModalOpen(false);
    },
  });

  // Handle form submission for updating a route
  const handleRouteEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoute) {
      updateRoute.mutate(selectedRoute);
    }
  };

  // Handle form submission for adding a new route
  const handleNewRoute = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoute = {
      id: Math.random().toString(36).substr(2, 9), // Random ID for new route
      start_point: selectedRoute?.start_point || '',
      end_point: selectedRoute?.end_point || '',
      hub_id: selectedRoute?.hub_id || '',
      cost: selectedRoute?.cost || 0,
    };
    addNewRoute.mutate(newRoute);
  };

  return (
    <div className="p-8">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search Routes"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 rounded-md border border-border mb-4 w-full"
      />

      {/* Routes List */}
      <div className="space-y-4">
        {filteredRoutes?.map((route) => (
          <div key={route.id} className="flex justify-between items-center p-4 border border-border rounded-md">
            <div>
              <h4 className="font-semibold">Route from {route.start_point} to {route.end_point}</h4>
              <p>Cost: ${route.cost}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => {
                  setSelectedRoute(route);
                  setIsEditModalOpen(true);
                }}
              >
                Edit
              </Button>
              <Button variant="destructive">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Route Button */}
      <Button
        onClick={() => {
          setIsNewRouteModalOpen(true);
          setSelectedRoute(null); // Reset selected route for new route form
        }}
        className="mt-4"
      >
        Add New Route
      </Button>

      {/* Edit Route Modal */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-50 ${isEditModalOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsEditModalOpen(false)} // Close on outside click
      >
        <div
          className="bg-white p-6 rounded-md w-1/3 absolute top-1/4 left-1/3"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold mb-4">Edit Route</h3>
          <form onSubmit={handleRouteEdit}>
            <div>
              <label>Start Point</label>
              <input
                type="text"
                value={selectedRoute?.start_point || ''}
                onChange={(e) => setSelectedRoute({ ...selectedRoute!, start_point: e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            <div>
              <label>End Point</label>
              <input
                type="text"
                value={selectedRoute?.end_point || ''}
                onChange={(e) => setSelectedRoute({ ...selectedRoute!, end_point: e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            <div>
              <label>Cost</label>
              <input
                type="number"
                value={selectedRoute?.cost || ''}
                onChange={(e) => setSelectedRoute({ ...selectedRoute!, cost: +e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            <Button type="submit" className="mt-4 w-full">Save Changes</Button>
          </form>
        </div>
      </div>

      {/* New Route Modal */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-50 ${isNewRouteModalOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsNewRouteModalOpen(false)} // Close on outside click
      >
        <div
          className="bg-white p-6 rounded-md w-1/3 absolute top-1/4 left-1/3"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold mb-4">Add New Route</h3>
          <form onSubmit={handleNewRoute}>
            <div>
              <label>Start Point</label>
              <input
                type="text"
                value={selectedRoute?.start_point || ''}
                onChange={(e) => setSelectedRoute({ ...selectedRoute!, start_point: e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            <div>
              <label>End Point</label>
              <input
                type="text"
                value={selectedRoute?.end_point || ''}
                onChange={(e) => setSelectedRoute({ ...selectedRoute!, end_point: e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            <div>
              <label>Cost</label>
              <input
                type="number"
                value={selectedRoute?.cost || ''}
                onChange={(e) => setSelectedRoute({ ...selectedRoute!, cost: +e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            <Button type="submit" className="mt-4 w-full">Add Route</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoutesPage;
