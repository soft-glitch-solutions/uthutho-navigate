
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { parseGoogleMapsUrl } from '@/utils/googleMaps';

interface Hub {
  id: string;
  name: string;
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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch routes
  const { data: routes, isLoading: routesLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('routes').select('*');
      if (error) throw error;
      return data as Route[];
    },
  });

  // Fetch hubs for dropdown selection
  const { data: hubs } = useQuery({
    queryKey: ['hubs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('hubs').select('id, name');
      if (error) throw error;
      return data as Hub[];
    },
  });

  // Filter routes based on search query
  const filteredRoutes = routes?.filter((route) =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.start_point.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.end_point.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.transport_type.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Add new route mutation
  const addNewRoute = useMutation({
    mutationFn: async (newRoute: Omit<Route, 'id'>) => {
      const { error } = await supabase.from('routes').insert([newRoute]);
      if (error) throw error;
      return newRoute;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      setIsNewRouteModalOpen(false);
      setStartPointUrl('');
      setEndPointUrl('');
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

  // Handle parsing of Google Maps URLs
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

  // Navigate to route details page
  const handleRouteSelect = (route: Route) => {
    navigate(`/admin/dashboard/routes/${route.id}`);
  };

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
                      onClick={() => {
                        setSelectedRoute(route);
                        setIsEditModalOpen(true);
                        setStartPointUrl('');
                        setEndPointUrl('');
                      }}
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

      {/* Edit Route Modal */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 ${isEditModalOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsEditModalOpen(false)}
      >
        <div
          className="bg-background p-6 rounded-md w-full md:w-[500px] lg:w-1/3 absolute top-0 right-0 h-full overflow-y-auto transform transition-transform duration-300"
          style={{
            transform: isEditModalOpen ? 'translateX(0)' : 'translateX(100%)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-semibold mb-6">Edit Route</h3>
          <form onSubmit={handleRouteEdit} className="space-y-4">
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
            
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={selectedRoute?.notes || ''}
                onChange={(e) => setSelectedRoute({ ...selectedRoute!, notes: e.target.value })}
                className="p-2 rounded-md border border-border w-full h-24"
                placeholder="Add any relevant notes about this route"
              />
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

      {/* New Route Modal */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 ${isNewRouteModalOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsNewRouteModalOpen(false)}
      >
        <div
          className="bg-background p-6 rounded-md w-full md:w-[500px] lg:w-1/3 absolute top-0 right-0 h-full overflow-y-auto transform transition-transform duration-300"
          style={{
            transform: isNewRouteModalOpen ? 'translateX(0)' : 'translateX(100%)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-semibold mb-6">Add New Route</h3>
          <form onSubmit={handleNewRoute} className="space-y-4">
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
            
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={selectedRoute?.notes || ''}
                onChange={(e) => setSelectedRoute({ ...selectedRoute!, notes: e.target.value })}
                className="p-2 rounded-md border border-border w-full h-24"
                placeholder="Add any relevant notes about this route"
              />
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

      {/* Delete Confirmation Modal */}
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
