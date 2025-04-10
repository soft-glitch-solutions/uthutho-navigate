
import { useState } from 'react';
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
  latitude: number;
  longitude: number;
  address: string | null;
  transport_type: string | null;
  notes: string | null;
}

const HubsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHub, setSelectedHub] = useState<Hub | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewHubModalOpen, setIsNewHubModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch hubs from the database
  const { data: hubs, isLoading } = useQuery({
    queryKey: ['hubs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('hubs').select('*');
      if (error) throw error;
      return data;
    },
  });

  // Filter hubs based on search query
  const filteredHubs = hubs?.filter((hub) =>
    hub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (hub.address && hub.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (hub.transport_type && hub.transport_type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Mutation for updating a hub
  const updateHub = useMutation({
    mutationFn: async (updatedHub: Hub) => {
      const { error } = await supabase.from('hubs').update(updatedHub).eq('id', updatedHub.id);
      if (error) throw error;
      return updatedHub;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hubs'] });
      setIsEditModalOpen(false);
      toast({
        title: "Success",
        description: "Hub has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update hub: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Mutation for deleting a hub
  const deleteHub = useMutation({
    mutationFn: async (hubId: string) => {
      const { error } = await supabase.from('hubs').delete().eq('id', hubId);
      if (error) throw error;
      return hubId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hubs'] });
      setIsDeleteModalOpen(false);
      toast({
        title: "Success",
        description: "Hub has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete hub: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Mutation for adding a new hub
  const addNewHub = useMutation({
    mutationFn: async (newHub: Omit<Hub, 'id'>) => {
      const { error } = await supabase.from('hubs').insert([newHub]);
      if (error) throw error;
      return newHub;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hubs'] });
      setIsNewHubModalOpen(false);
      setGoogleMapsUrl('');
      toast({
        title: "Success",
        description: "New hub has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add hub: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleGoogleMapsUrlChange = (url: string) => {
    setGoogleMapsUrl(url);
    const { latitude, longitude } = parseGoogleMapsUrl(url);
    
    if (latitude && longitude) {
      if (selectedHub) {
        setSelectedHub({
          ...selectedHub,
          latitude,
          longitude
        });
      } else {
        setSelectedHub({
          id: '',
          name: '',
          latitude,
          longitude,
          address: null,
          transport_type: null,
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

  // Handle form submission for updating a hub
  const handleHubEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedHub) {
      updateHub.mutate(selectedHub);
    }
  };

  // Handle form submission for adding a new hub
  const handleNewHub = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedHub) {
      toast({
        title: "Error",
        description: "Please provide hub information including coordinates from Google Maps.",
        variant: "destructive",
      });
      return;
    }
    
    // Check required fields
    if (!selectedHub.name || !selectedHub.latitude || !selectedHub.longitude) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const newHub = {
      name: selectedHub.name,
      latitude: selectedHub.latitude,
      longitude: selectedHub.longitude,
      address: selectedHub.address,
      transport_type: selectedHub.transport_type,
      notes: selectedHub.notes
    };
    
    addNewHub.mutate(newHub);
  };

  // Handle selecting a hub and navigating to the HubDetailsPage
  const handleHubSelect = (hub: Hub) => {
    navigate(`/admin/dashboard/hubs/${hub.id}`);
  };

  return (
    <div className="p-4 md:p-8">
      {/* Search Input and Add New Hub Button */}
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <input
          type="text"
          placeholder="Search hubs by name, address, or transport type"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 rounded-md border border-border w-full md:w-2/3"
        />
        <Button
          onClick={() => {
            setIsNewHubModalOpen(true);
            setSelectedHub(null);
            setGoogleMapsUrl('');
          }}
          className="w-full md:w-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Hub
        </Button>
      </div>

      {/* Hub List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : filteredHubs?.length === 0 ? (
          <div className="col-span-full text-center p-8">
            No hubs found matching your search criteria.
          </div>
        ) : (
          filteredHubs?.map((hub) => (
            <div key={hub.id} className="border border-border rounded-md overflow-hidden bg-card hover:shadow-md transition-shadow">
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{hub.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{hub.address || 'No address available'}</p>
                {hub.transport_type && (
                  <div className="mb-3">
                    <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                      {hub.transport_type}
                    </span>
                  </div>
                )}
                {hub.notes && (
                  <p className="text-sm mb-3 line-clamp-2">
                    <span className="font-medium">Notes:</span> {hub.notes}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleHubSelect(hub)}
                    className="flex-1"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedHub(hub);
                      setIsEditModalOpen(true);
                      setGoogleMapsUrl('');
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
                      setSelectedHub(hub);
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

      {/* Edit Hub Modal (Slide from Right) */}
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
          <h3 className="text-xl font-semibold mb-6">Edit Hub</h3>
          <form onSubmit={handleHubEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hub Name *</label>
              <input
                type="text"
                value={selectedHub?.name || ''}
                onChange={(e) => setSelectedHub({ ...selectedHub!, name: e.target.value })}
                className="p-2 rounded-md border border-border w-full"
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
                  placeholder="Paste Google Maps URL here"
                  className="p-2 rounded-md border border-border w-full"
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
                <label className="block text-sm font-medium mb-1">Latitude *</label>
                <input
                  type="number"
                  step="0.000001"
                  value={selectedHub?.latitude || ''}
                  onChange={(e) => setSelectedHub({ ...selectedHub!, latitude: parseFloat(e.target.value) })}
                  className="p-2 rounded-md border border-border w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Longitude *</label>
                <input
                  type="number"
                  step="0.000001"
                  value={selectedHub?.longitude || ''}
                  onChange={(e) => setSelectedHub({ ...selectedHub!, longitude: parseFloat(e.target.value) })}
                  className="p-2 rounded-md border border-border w-full"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                value={selectedHub?.address || ''}
                onChange={(e) => setSelectedHub({ ...selectedHub!, address: e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Transport Type</label>
              <select
                value={selectedHub?.transport_type || ''}
                onChange={(e) => setSelectedHub({ ...selectedHub!, transport_type: e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              >
                <option value="">Select transport type</option>
                <option value="bus">Bus</option>
                <option value="taxi">Taxi</option>
                <option value="train">Train</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={selectedHub?.notes || ''}
                onChange={(e) => setSelectedHub({ ...selectedHub!, notes: e.target.value })}
                className="p-2 rounded-md border border-border w-full h-24"
                placeholder="Add any relevant notes about this hub"
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
                disabled={updateHub.isPending}
              >
                {updateHub.isPending ? (
                  <>
                    <span className="animate-spin mr-2">↻</span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* New Hub Modal (Slide from Right) */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 ${isNewHubModalOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsNewHubModalOpen(false)}
      >
        <div
          className="bg-background p-6 rounded-md w-full md:w-[500px] lg:w-1/3 absolute top-0 right-0 h-full overflow-y-auto transform transition-transform duration-300"
          style={{
            transform: isNewHubModalOpen ? 'translateX(0)' : 'translateX(100%)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-semibold mb-6">Add New Hub</h3>
          <form onSubmit={handleNewHub} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hub Name *</label>
              <input
                type="text"
                value={selectedHub?.name || ''}
                onChange={(e) => setSelectedHub({ 
                  ...selectedHub || {
                    id: '',
                    latitude: 0,
                    longitude: 0,
                    address: null,
                    transport_type: null,
                    notes: null
                  },
                  name: e.target.value
                })}
                className="p-2 rounded-md border border-border w-full"
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
                  placeholder="Paste Google Maps URL here"
                  className="p-2 rounded-md border border-border w-full"
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
                <label className="block text-sm font-medium mb-1">Latitude *</label>
                <input
                  type="number"
                  step="0.000001"
                  value={selectedHub?.latitude || ''}
                  onChange={(e) => setSelectedHub({ 
                    ...selectedHub || {
                      id: '',
                      name: '',
                      longitude: 0,
                      address: null,
                      transport_type: null,
                      notes: null
                    },
                    latitude: parseFloat(e.target.value)
                  })}
                  className="p-2 rounded-md border border-border w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Longitude *</label>
                <input
                  type="number"
                  step="0.000001"
                  value={selectedHub?.longitude || ''}
                  onChange={(e) => setSelectedHub({ 
                    ...selectedHub || {
                      id: '',
                      name: '',
                      latitude: 0,
                      address: null,
                      transport_type: null,
                      notes: null
                    },
                    longitude: parseFloat(e.target.value)
                  })}
                  className="p-2 rounded-md border border-border w-full"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                value={selectedHub?.address || ''}
                onChange={(e) => setSelectedHub({ 
                  ...selectedHub || {
                    id: '',
                    name: '',
                    latitude: 0,
                    longitude: 0,
                    transport_type: null,
                    notes: null
                  },
                  address: e.target.value
                })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Transport Type</label>
              <select
                value={selectedHub?.transport_type || ''}
                onChange={(e) => setSelectedHub({ 
                  ...selectedHub || {
                    id: '',
                    name: '',
                    latitude: 0,
                    longitude: 0,
                    address: null,
                    notes: null
                  },
                  transport_type: e.target.value
                })}
                className="p-2 rounded-md border border-border w-full"
              >
                <option value="">Select transport type</option>
                <option value="bus">Bus</option>
                <option value="taxi">Taxi</option>
                <option value="train">Train</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={selectedHub?.notes || ''}
                onChange={(e) => setSelectedHub({ 
                  ...selectedHub || {
                    id: '',
                    name: '',
                    latitude: 0,
                    longitude: 0,
                    address: null,
                    transport_type: null
                  },
                  notes: e.target.value
                })}
                className="p-2 rounded-md border border-border w-full h-24"
                placeholder="Add any relevant notes about this hub"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsNewHubModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={addNewHub.isPending}
              >
                {addNewHub.isPending ? (
                  <>
                    <span className="animate-spin mr-2">↻</span>
                    Adding...
                  </>
                ) : (
                  'Add Hub'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {selectedHub && (
        <div
          className={`fixed inset-0 bg-black/50 z-50 ${isDeleteModalOpen ? 'block' : 'hidden'}`}
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-background p-6 rounded-md max-w-md mx-auto mt-[20vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Delete Hub</h3>
            <p className="mb-6">
              Are you sure you want to delete "{selectedHub.name}"? This action cannot be undone.
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
                onClick={() => deleteHub.mutate(selectedHub.id)}
                disabled={deleteHub.isPending}
              >
                {deleteHub.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HubsPage;
