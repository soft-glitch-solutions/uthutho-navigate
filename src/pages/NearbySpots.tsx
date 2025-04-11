
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Plus, Map, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NearbySpot {
  id: string;
  stop_id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance_meters: number | null;
  created_at: string;
  updated_at: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
}

interface Stop {
  id: string;
  name: string;
}

const NearbySpots = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpot, setSelectedSpot] = useState<NearbySpot | null>(null);
  const [selectedStop, setSelectedStop] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Forms states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    latitude: 0,
    longitude: 0,
    distance_meters: 0,
    image_url: '',
  });

  // Fetch nearby spots
  const { data: nearbySpots, isLoading } = useQuery({
    queryKey: ['nearbySpots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nearby_spots')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as NearbySpot[];
    },
  });

  // Fetch stops for dropdown
  const { data: stops } = useQuery({
    queryKey: ['stops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stops')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data as Stop[];
    },
  });

  // Filter nearby spots based on search query
  const filteredSpots = nearbySpots?.filter((spot) =>
    spot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mutation for creating a new nearby spot
  const createSpot = useMutation({
    mutationFn: async (newSpot: Omit<NearbySpot, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('nearby_spots')
        .insert([newSpot])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nearbySpots'] });
      setIsModalOpen(false);
      resetForm();
      toast({
        title: "Spot created",
        description: "The new nearby spot has been successfully created.",
      });
    },
  });

  // Mutation for updating a nearby spot
  const updateSpot = useMutation({
    mutationFn: async (updatedSpot: NearbySpot) => {
      const { error } = await supabase
        .from('nearby_spots')
        .update({
          name: updatedSpot.name,
          description: updatedSpot.description,
          category: updatedSpot.category,
          latitude: updatedSpot.latitude,
          longitude: updatedSpot.longitude,
          distance_meters: updatedSpot.distance_meters,
          image_url: updatedSpot.image_url,
        })
        .eq('id', updatedSpot.id);
      
      if (error) throw error;
      return updatedSpot;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nearbySpots'] });
      setIsModalOpen(false);
      resetForm();
      toast({
        title: "Spot updated",
        description: "The nearby spot has been successfully updated.",
      });
    },
  });

  // Mutation for deleting a nearby spot
  const deleteSpot = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('nearby_spots')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nearbySpots'] });
      setIsDeleteModalOpen(false);
      toast({
        title: "Spot deleted",
        description: "The nearby spot has been successfully deleted.",
      });
    },
  });

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      latitude: 0,
      longitude: 0,
      distance_meters: 0,
      image_url: '',
    });
    setSelectedStop('');
    setSelectedSpot(null);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStop) {
      toast({
        title: "Error",
        description: "Please select a stop.",
        variant: "destructive",
      });
      return;
    }

    const spot = {
      name: formData.name,
      description: formData.description || null,
      category: formData.category || null,
      latitude: formData.latitude,
      longitude: formData.longitude,
      stop_id: selectedStop,
      distance_meters: formData.distance_meters || null,
      image_url: formData.image_url || null,
    };

    if (selectedSpot) {
      updateSpot.mutate({ ...spot, id: selectedSpot.id, created_at: selectedSpot.created_at, updated_at: selectedSpot.updated_at });
    } else {
      createSpot.mutate(spot);
    }
  };

  // Handle edit spot
  const handleEdit = (spot: NearbySpot) => {
    setSelectedSpot(spot);
    setSelectedStop(spot.stop_id);
    setFormData({
      name: spot.name,
      description: spot.description || '',
      category: spot.category || '',
      latitude: spot.latitude,
      longitude: spot.longitude,
      distance_meters: spot.distance_meters || 0,
      image_url: spot.image_url || '',
    });
    setIsModalOpen(true);
  };

  // Get stop name by ID
  const getStopName = (stopId: string) => {
    const stop = stops?.find(s => s.id === stopId);
    return stop ? stop.name : 'Unknown Stop';
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Nearby Spots</h1>
      
      {/* Search Input and Add Button */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search spots by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Spot
        </Button>
      </div>

      {/* Nearby Spots List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : filteredSpots?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No nearby spots found</div>
        ) : (
          filteredSpots?.map((spot) => (
            <Card key={spot.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between">
                  {spot.name}
                  {spot.category && (
                    <span className="text-sm font-normal px-2 py-1 bg-secondary/20 rounded-full">
                      {spot.category}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Associated Stop</p>
                    <p className="text-sm font-medium">{getStopName(spot.stop_id)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Distance</p>
                    <p className="text-sm">{spot.distance_meters ? `${spot.distance_meters} meters` : 'Not specified'}</p>
                  </div>
                </div>
                
                {spot.description && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{spot.description}</p>
                  </div>
                )}
                
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Coordinates</p>
                  <p className="text-sm">{spot.latitude}, {spot.longitude}</p>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleEdit(spot)}
                    size="sm"
                    className="flex items-center"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedSpot(spot);
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

      {/* Add/Edit Modal */}
      <div
        className={`fixed inset-0 bg-black/50 ${isModalOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsModalOpen(false)}
      >
        <div
          className="bg-background p-6 rounded-md w-full md:w-[600px] mx-auto mt-20 max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold mb-4">
            {selectedSpot ? 'Edit Nearby Spot' : 'Add New Nearby Spot'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Associated Stop *</label>
                <Select value={selectedStop} onValueChange={setSelectedStop}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a stop" />
                  </SelectTrigger>
                  <SelectContent>
                    {stops?.map((stop) => (
                      <SelectItem key={stop.id} value={stop.id}>
                        {stop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="cafe">Cafe</SelectItem>
                    <SelectItem value="shop">Shop</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-border rounded-md"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Latitude *</label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Longitude *</label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Distance (meters)</label>
                <Input
                  type="number"
                  value={formData.distance_meters}
                  onChange={(e) => setFormData({ ...formData, distance_meters: parseInt(e.target.value) })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <Input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {selectedSpot ? 'Update' : 'Create'} Spot
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {selectedSpot && (
        <div
          className={`fixed inset-0 bg-black/50 ${isDeleteModalOpen ? 'block' : 'hidden'}`}
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-background p-6 rounded-md w-full md:w-[500px] mx-auto mt-20"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete the nearby spot "{selectedSpot.name}"?</p>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="destructive"
                onClick={() => deleteSpot.mutate(selectedSpot.id)}
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

export default NearbySpots;
