import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Hub {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
}

const HubsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHub, setSelectedHub] = useState<Hub | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewHubModalOpen, setIsNewHubModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
    hub.name.toLowerCase().includes(searchQuery.toLowerCase())
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
    },
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
    },
  });

  // Mutation for adding a new hub
  const addNewHub = useMutation({
    mutationFn: async (newHub: Hub) => {
      const { error } = await supabase.from('hubs').insert([newHub]);
      if (error) throw error;
      return newHub;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hubs'] });
      setIsNewHubModalOpen(false);
    },
  });

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
    const newHub = {
      id: Math.random().toString(36).substr(2, 9), // Random ID for new hub
      name: selectedHub?.name || '',
      latitude: selectedHub?.latitude || 0,
      longitude: selectedHub?.longitude || 0,
      address: selectedHub?.address || null,
    };
    addNewHub.mutate(newHub);
  };

  // Handle selecting a hub and navigating to the HubDetailsPage
  const handleHubSelect = (hub: Hub) => {
    navigate(`/admin/dashboard/hubs/${hub.id}`);
  };

  return (
    <div className="p-8">
      {/* Search Input and Add New Hub Button */}
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search Hubs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 rounded-md border border-border w-full"
        />
        <Button
          onClick={() => {
            setIsNewHubModalOpen(true);
            setSelectedHub(null);
          }}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Hub
        </Button>
      </div>

      {/* Hub List */}
      <div className="space-y-4">
        {filteredHubs?.map((hub) => (
          <div key={hub.id} className="flex justify-between items-center p-4 border border-border rounded-md">
            <div>
              <h4 className="font-semibold">{hub.name}</h4>
              <p>{hub.address || 'No address available'}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => handleHubSelect(hub)}
              >
                View Details
              </Button>
              <Button
                onClick={() => {
                  setSelectedHub(hub);
                  setIsEditModalOpen(true);
                }}
              >
                <Edit className="h-5 w-5 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setSelectedHub(hub);
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

      {/* Edit Hub Modal (Slide from Right) */}
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
          <h3 className="text-lg font-semibold mb-4">Edit Hub</h3>
          <form onSubmit={handleHubEdit}>
            <div>
              <label>Name</label>
              <input
                type="text"
                value={selectedHub?.name || ''}
                onChange={(e) => setSelectedHub({ ...selectedHub!, name: e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            <div>
              <label>Address</label>
              <input
                type="text"
                value={selectedHub?.address || ''}
                onChange={(e) => setSelectedHub({ ...selectedHub!, address: e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            <div>
              <label>Latitude</label>
              <input
                type="number"
                value={selectedHub?.latitude || ''}
                onChange={(e) => setSelectedHub({ ...selectedHub!, latitude: +e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            <div>
              <label>Longitude</label>
              <input
                type="number"
                value={selectedHub?.longitude || ''}
                onChange={(e) => setSelectedHub({ ...selectedHub!, longitude: +e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            <Button type="submit" className="mt-4 w-full">Save Changes</Button>
          </form>
        </div>
      </div>

      {/* New Hub Modal (Slide from Right) */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-50 ${isNewHubModalOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsNewHubModalOpen(false)}
      >
        <div
          className="bg-white p-6 rounded-md w-1/3 absolute top-0 right-0 h-full transform transition-transform duration-300"
          style={{
            transform: isNewHubModalOpen ? 'translateX(0)' : 'translateX(100%)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold mb-4">Add New Hub</h3>
          <form onSubmit={handleNewHub}>
            <div>
              <label>Name</label>
              <input
                type="text"
                value={selectedHub?.name || ''}
                onChange={(e) => setSelectedHub({ ...selectedHub!, name: e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            <div>
              <label>Address</label>
              <input
                type="text"
                value={selectedHub?.address || ''}
                onChange={(e) => setSelectedHub({ ...selectedHub!, address: e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            <div>
              <label>Latitude</label>
              <input
                type="number"
                value={selectedHub?.latitude || ''}
                onChange={(e) => setSelectedHub({ ...selectedHub!, latitude: +e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            <div>
              <label>Longitude</label>
              <input
                type="number"
                value={selectedHub?.longitude || ''}
                onChange={(e) => setSelectedHub({ ...selectedHub!, longitude: +e.target.value })}
                className="p-2 rounded-md border border-border w-full"
              />
            </div>
            <Button type="submit" className="mt-4 w-full">Add Hub</Button>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {selectedHub && (
        <div
          className={`fixed inset-0 bg-gray-800 bg-opacity-50 ${isDeleteModalOpen ? 'block' : 'hidden'}`}
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-md w-1/3 absolute top-1/4 left-1/3"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this hub?</h3>
            <div className="flex space-x-4">
              <Button
                variant="destructive"
                onClick={() => deleteHub.mutate(selectedHub.id)}
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

export default HubsPage;
