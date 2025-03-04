
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Search, Edit, Save, Plus, ArrowLeft, MapPin, StopCircle } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Route {
  id: string;
  name: string;
  start_point: string;
  end_point: string;
  transport_type: string;
  cost: number;
  hub_id: string | null;
}

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

const RouteDetailsPage = () => {
  const { routeId } = useParams<{ routeId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddStopDialog, setShowAddStopDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state for route editing
  const [routeForm, setRouteForm] = useState<Partial<Route>>({
    name: '',
    start_point: '',
    end_point: '',
    transport_type: '',
    cost: 0,
  });

  // Form state for new stop
  const [newStop, setNewStop] = useState({
    name: '',
    latitude: 0,
    longitude: 0,
    order_number: 0,
    cost: 0,
  });

  // Fetch route details
  const { data: route, isLoading: isLoadingRoute } = useQuery({
    queryKey: ['route', routeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('id', routeId)
        .single();
      if (error) throw error;
      setRouteForm({
        name: data.name,
        start_point: data.start_point,
        end_point: data.end_point,
        transport_type: data.transport_type,
        cost: data.cost,
      });
      return data as Route;
    },
  });

  // Fetch stops related to the route
  const { data: stops } = useQuery({
    queryKey: ['stops', routeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stops')
        .select('*')
        .eq('route_id', routeId)
        .order('order_number', { ascending: true });
      if (error) throw error;
      
      // Set the order_number for new stop to be one more than the highest
      if (data && data.length > 0) {
        const maxOrder = Math.max(...data.map(stop => stop.order_number));
        setNewStop({...newStop, order_number: maxOrder + 1});
      }
      
      return data as Stop[];
    },
  });

  // Update route mutation
  const updateRouteMutation = useMutation({
    mutationFn: async (updatedRoute: Partial<Route>) => {
      const { error } = await supabase
        .from('routes')
        .update(updatedRoute)
        .eq('id', routeId as string);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['route', routeId] });
      toast({
        title: "Route updated",
        description: "The route has been updated successfully.",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update route: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Add stop mutation
  const addStopMutation = useMutation({
    mutationFn: async (stop: typeof newStop) => {
      const { data, error } = await supabase
        .from('stops')
        .insert([{ ...stop, route_id: routeId }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stops', routeId] });
      toast({
        title: "Stop added",
        description: "The stop has been added successfully.",
      });
      setShowAddStopDialog(false);
      setNewStop({
        name: '',
        latitude: 0,
        longitude: 0,
        order_number: newStop.order_number + 1,
        cost: 0,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add stop: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSaveRoute = () => {
    updateRouteMutation.mutate(routeForm);
  };

  const handleAddStop = () => {
    addStopMutation.mutate(newStop);
  };

  const filteredStops = stops?.filter(stop =>
    stop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoadingRoute) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link to="/admin/dashboard/routes" className="text-primary hover:underline mb-4 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Routes
        </Link>
        
        {isEditing ? (
          <div className="mt-4 space-y-4 bg-card p-6 rounded-lg border border-border">
            <h1 className="text-2xl font-bold text-foreground mb-4">Edit Route</h1>
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Route Name</Label>
                <Input 
                  id="name" 
                  value={routeForm.name} 
                  onChange={(e) => setRouteForm({...routeForm, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="start_point">Start Point</Label>
                <Input 
                  id="start_point" 
                  value={routeForm.start_point} 
                  onChange={(e) => setRouteForm({...routeForm, start_point: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end_point">End Point</Label>
                <Input 
                  id="end_point" 
                  value={routeForm.end_point} 
                  onChange={(e) => setRouteForm({...routeForm, end_point: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transport_type">Transport Type</Label>
                <Select 
                  value={routeForm.transport_type || ''} 
                  onValueChange={(value) => setRouteForm({...routeForm, transport_type: value})}
                >
                  <SelectTrigger id="transport_type">
                    <SelectValue placeholder="Select transport type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="taxi">Taxi</SelectItem>
                    <SelectItem value="train">Train</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cost">Cost (R)</Label>
                <Input 
                  id="cost" 
                  type="number"
                  min="0"
                  step="0.01"
                  value={routeForm.cost?.toString()} 
                  onChange={(e) => setRouteForm({...routeForm, cost: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleSaveRoute} disabled={updateRouteMutation.isPending}>
                {updateRouteMutation.isPending ? (
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
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{route?.name}</h1>
              <p className="text-muted-foreground">{route?.start_point} → {route?.end_point}</p>
              <p className="text-muted-foreground mt-1">
                Cost: R{route?.cost.toFixed(2)}
              </p>
              {route?.transport_type && (
                <span className="inline-block bg-primary/10 text-primary text-sm px-2 py-1 rounded mt-2">
                  {route.transport_type}
                </span>
              )}
            </div>
            <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-2" /> Edit Route
            </Button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">Stops</h2>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search stops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-60"
              />
            </div>
            <Button onClick={() => setShowAddStopDialog(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Stop
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredStops?.length === 0 ? (
            <p className="text-muted-foreground">No stops found for this route.</p>
          ) : (
            filteredStops?.map((stop) => (
              <div
                key={stop.id}
                className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                onClick={() => navigate(`/admin/dashboard/stops/${stop.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-foreground flex items-center">
                      <StopCircle className="h-4 w-4 mr-2 text-primary" />
                      {stop.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Stop #{stop.order_number}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 inline-block mr-1" />
                      {stop.latitude.toFixed(6)}, {stop.longitude.toFixed(6)}
                    </p>
                  </div>
                  <div className="text-right">
                    {stop.cost !== null && (
                      <span className="text-sm font-medium text-foreground">
                        R{stop.cost.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Stop Dialog */}
      <Dialog open={showAddStopDialog} onOpenChange={setShowAddStopDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Stop</DialogTitle>
            <DialogDescription>
              Create a new stop on this route.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="stopName">Stop Name</Label>
              <Input 
                id="stopName" 
                value={newStop.name} 
                onChange={(e) => setNewStop({...newStop, name: e.target.value})}
                placeholder="e.g., Main Road Junction"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number</Label>
              <Input 
                id="orderNumber" 
                type="number"
                min="1"
                value={newStop.order_number.toString()} 
                onChange={(e) => setNewStop({...newStop, order_number: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input 
                  id="latitude" 
                  type="number"
                  step="0.000001"
                  value={newStop.latitude.toString()} 
                  onChange={(e) => setNewStop({...newStop, latitude: parseFloat(e.target.value) || 0})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input 
                  id="longitude" 
                  type="number"
                  step="0.000001"
                  value={newStop.longitude.toString()} 
                  onChange={(e) => setNewStop({...newStop, longitude: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cost">Cost (R) - Optional</Label>
              <Input 
                id="cost" 
                type="number"
                min="0"
                step="0.01"
                value={newStop.cost.toString()} 
                onChange={(e) => setNewStop({...newStop, cost: parseFloat(e.target.value) || 0})}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddStopDialog(false)}>Cancel</Button>
            <Button onClick={handleAddStop} disabled={addStopMutation.isPending}>
              {addStopMutation.isPending ? 'Adding...' : 'Add Stop'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RouteDetailsPage;
