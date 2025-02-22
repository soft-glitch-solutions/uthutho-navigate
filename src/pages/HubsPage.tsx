import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react'; // Ensure icons are imported

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
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries(['hubs']);
      setIsEditModalOpen(false);
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
      queryClient.invalidateQueries(['hubs']);
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

  return (
    <div className="p-8">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search Hubs"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 rounded-md border border-border mb-4 w-full"
      />

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
                onClick={() => {
                  setSelectedHub(hub);
                  setIsEditModalOpen(true);
                }}
              >
                <Edit className="h-5 w-5 mr-2" />
                Edit
              </Button>
              <Button variant="destructive">
                <Trash2 className="h-5 w-5 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Hub Button */}
      <Button
        onClick={() => {
          setIsNewHubModalOpen(true);
          setSelectedHub(null); // Reset selected hub for new hub form
        }}
        className="mt-4"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add New Hub
      </Button>

      {/* Edit Hub Modal */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-50 ${isEditModalOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsEditModalOpen(false)} // Close on outside click
      >
        <div
          className="bg-white p-6 rounded-md w-1/3 absolute top-1/4 left-1/3"
          onClick={(e) => e.stopPropagation()} // Stop propagation to avoid closing modal when clicking inside
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

      {/* New Hub Modal */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-50 ${isNewHubModalOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsNewHubModalOpen(false)} // Close on outside click
      >
        <div
          className="bg-white p-6 rounded-md w-1/3 absolute top-1/4 left-1/3"
          onClick={(e) => e.stopPropagation()} // Stop propagation to avoid closing modal when clicking inside
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
    </div>
  );
};

export default HubsPage;
