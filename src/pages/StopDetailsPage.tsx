
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Save, ArrowLeft, MapPin } from 'lucide-react';

interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  order_number: number;
  route_id: string;
  cost: number | null;
  image_url: string | null;
}

interface Route {
  id: string;
  name: string;
}

const StopDetailsPage = () => {
  const { stopId } = useParams<{ stopId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state for stop editing
  const [stopForm, setStopForm] = useState<Partial<Stop>>({
    name: '',
    latitude: 0,
    longitude: 0,
    order_number: 0,
    cost: 0,
    image_url: '',
  });

  // Fetch stop details
  const { data: stop, isLoading: isLoadingStop } = useQuery({
    queryKey: ['stop', stopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stops')
        .select('*')
        .eq('id', stopId)
        .single();
      if (error) throw error;
      setStopForm({
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        order_number: data.order_number,
        cost: data.cost,
        image_url: data.image_url,
      });
      return data as Stop;
    },
  });

  // Fetch related route
  const { data: route } = useQuery({
    queryKey: ['route', stop?.route_id],
    enabled: !!stop?.route_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routes')
        .select('id, name')
        .eq('id', stop?.route_id)
        .single();
      if (error) throw error;
      return data as Route;
    },
  });

  // Update stop mutation
  const updateStopMutation = useMutation({
    mutationFn: async (updatedStop: Partial<Stop>) => {
      const { error } = await supabase
        .from('stops')
        .update(updatedStop)
        .eq('id', stopId as string);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stop', stopId] });
      toast({
        title: "Stop updated",
        description: "The stop has been updated successfully.",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update stop: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSaveStop = () => {
    updateStopMutation.mutate(stopForm);
  };

  if (isLoadingStop) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        {route && (
          <Link to={`/admin/dashboard/routes/${route.id}`} className="text-primary hover:underline mb-4 inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to {route.name}
          </Link>
        )}
        
        {isEditing ? (
          <div className="mt-4 space-y-4 bg-card p-6 rounded-lg border border-border">
            <h1 className="text-2xl font-bold text-foreground mb-4">Edit Stop</h1>
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Stop Name</Label>
                <Input 
                  id="name" 
                  value={stopForm.name} 
                  onChange={(e) => setStopForm({...stopForm, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="order_number">Order Number</Label>
                <Input 
                  id="order_number" 
                  type="number"
                  min="1"
                  value={stopForm.order_number?.toString()} 
                  onChange={(e) => setStopForm({...stopForm, order_number: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input 
                    id="latitude" 
                    type="number"
                    step="0.000001"
                    value={stopForm.latitude?.toString()} 
                    onChange={(e) => setStopForm({...stopForm, latitude: parseFloat(e.target.value) || 0})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input 
                    id="longitude" 
                    type="number"
                    step="0.000001"
                    value={stopForm.longitude?.toString()} 
                    onChange={(e) => setStopForm({...stopForm, longitude: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cost">Cost (R)</Label>
                <Input 
                  id="cost" 
                  type="number"
                  min="0"
                  step="0.01"
                  value={stopForm.cost?.toString() || ''} 
                  onChange={(e) => setStopForm({...stopForm, cost: parseFloat(e.target.value) || 0})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input 
                  id="image_url" 
                  value={stopForm.image_url || ''} 
                  onChange={(e) => setStopForm({...stopForm, image_url: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleSaveStop} disabled={updateStopMutation.isPending}>
                {updateStopMutation.isPending ? (
                  <span className="flex items-center">
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></span>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </span>
                )}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{stop?.name}</h1>
                <p className="text-muted-foreground">Stop #{stop?.order_number}</p>
                <p className="text-muted-foreground mt-1 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {stop?.latitude.toFixed(6)}, {stop?.longitude.toFixed(6)}
                </p>
                {stop?.cost !== null && (
                  <p className="text-muted-foreground mt-1">
                    Cost: R{stop.cost.toFixed(2)}
                  </p>
                )}
              </div>
              <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-2" /> Edit Stop
              </Button>
            </div>
            
            {stop?.image_url && (
              <div className="mt-4">
                <img 
                  src={stop.image_url} 
                  alt={stop.name} 
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StopDetailsPage;
