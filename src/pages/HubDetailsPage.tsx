
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Search, Edit, Save, Plus, ArrowLeft, MapPin, Route as RouteIcon } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Route {
  id: string;
  name: string;
  start_point: string;
  end_point: string;
  transport_type: string;
  cost: number;
}

interface Hub {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  transport_type: string | null;
  image: string | null;
}

const HubDetailsPage = () => {
  const { hubId } = useParams<{ hubId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddRouteDialog, setShowAddRouteDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state for hub editing
  const [hubForm, setHubForm] = useState<Partial<Hub>>({
    name: '',
    address: '',
    transport_type: '',
  });

  // Form state for new route
  const [newRoute, setNewRoute] = useState({
    name: '',
    start_point: '',
    end_point: '',
    transport_type: 'bus',
    cost: 0,
  });

  // Fetch hub details
  const { data: hub, isLoading: isLoadingHub } = useQuery({
    queryKey: ['hub', hubId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hubs')
        .select('*')
        .eq('id', hubId)
        .single();
      if (error) throw error;
      setHubForm({
        name: data.name,
        address: data.address,
        transport_type: data.transport_type,
      });
      return data as Hub;
    },
  });

  // Fetch routes related to the hub
  const { data: routes } = useQuery({
    queryKey: ['routes', hubId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('hub_id', hubId);
      if (error) throw error;
      return data as Route[];
    },
  });

  // Update hub mutation
  const updateHubMutation = useMutation({
    mutationFn: async (updatedHub: Partial<Hub>) => {
      const { error } = await supabase
        .from('hubs')
        .update(updatedHub)
        .eq('id', hubId as string);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hub', hubId] });
      toast({
        title: "Hub updated",
        description: "The hub has been updated successfully.",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update hub: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Add route mutation
  const addRouteMutation = useMutation({
    mutationFn: async (route: typeof newRoute) => {
      const { data, error } = await supabase
        .from('routes')
        .insert([{ ...route, hub_id: hubId }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes', hubId] });
      toast({
        title: "Route added",
        description: "The route has been added successfully.",
      });
      setShowAddRouteDialog(false);
      setNewRoute({
        name: '',
        start_point: '',
        end_point: '',
        transport_type: 'bus',
        cost: 0,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add route: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSaveHub = () => {
    updateHubMutation.mutate(hubForm);
  };

  const handleAddRoute = () => {
    addRouteMutation.mutate(newRoute);
  };

  const filteredRoutes = routes?.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.start_point.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.end_point.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoadingHub) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link to="/admin/dashboard/hubs" className="text-primary hover:underline mb-4 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Hubs
        </Link>
        
        {isEditing ? (
          <div className="mt-4 space-y-4 bg-card p-6 rounded-lg border border-border">
            <h1 className="text-2xl font-bold text-foreground mb-4">Edit Hub</h1>
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Hub Name</Label>
                <Input 
                  id="name" 
                  value={hubForm.name} 
                  onChange={(e) => setHubForm({...hubForm, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address" 
                  value={hubForm.address || ''} 
                  onChange={(e) => setHubForm({...hubForm, address: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transport_type">Transport Type</Label>
                <Select 
                  value={hubForm.transport_type || ''} 
                  onValueChange={(value) => setHubForm({...hubForm, transport_type: value})}
                >
                  <SelectTrigger id="transport_type">
                    <SelectValue placeholder="Select transport type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="taxi">Taxi</SelectItem>
                    <SelectItem value="train">Train</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleSaveHub} disabled={updateHubMutation.isPending}>
                {updateHubMutation.isPending ? (
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
              <h1 className="text-2xl font-bold text-foreground">{hub?.name}</h1>
              <p className="text-muted-foreground">{hub?.address}</p>
              <p className="text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 inline-block mr-1" />
                {hub?.latitude.toFixed(6)}, {hub?.longitude.toFixed(6)}
              </p>
              {hub?.transport_type && (
                <span className="inline-block bg-primary/10 text-primary text-sm px-2 py-1 rounded mt-2">
                  {hub.transport_type}
                </span>
              )}
            </div>
            <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-2" /> Edit Hub
            </Button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">Routes</h2>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search routes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-60"
              />
            </div>
            <Button onClick={() => setShowAddRouteDialog(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Route
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredRoutes?.length === 0 ? (
            <p className="text-muted-foreground">No routes found for this hub.</p>
          ) : (
            filteredRoutes?.map((route) => (
              <div
                key={route.id}
                className="bg-card p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                onClick={() => navigate(`/admin/dashboard/routes/${route.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-foreground flex items-center">
                      <RouteIcon className="h-4 w-4 mr-2 text-primary" />
                      {route.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {route.start_point} → {route.end_point}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-foreground">
                      R{route.cost.toFixed(2)}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {route.transport_type}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Route Dialog */}
      <Dialog open={showAddRouteDialog} onOpenChange={setShowAddRouteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Route</DialogTitle>
            <DialogDescription>
              Create a new route connected to this hub.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="routeName">Route Name</Label>
              <Input 
                id="routeName" 
                value={newRoute.name} 
                onChange={(e) => setNewRoute({...newRoute, name: e.target.value})}
                placeholder="e.g., Cape Town to Bellville"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startPoint">Start Point</Label>
              <Input 
                id="startPoint" 
                value={newRoute.start_point} 
                onChange={(e) => setNewRoute({...newRoute, start_point: e.target.value})}
                placeholder="e.g., Cape Town CBD"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endPoint">End Point</Label>
              <Input 
                id="endPoint" 
                value={newRoute.end_point} 
                onChange={(e) => setNewRoute({...newRoute, end_point: e.target.value})}
                placeholder="e.g., Bellville"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transportType">Transport Type</Label>
              <Select 
                value={newRoute.transport_type} 
                onValueChange={(value) => setNewRoute({...newRoute, transport_type: value})}
              >
                <SelectTrigger id="transportType">
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
                value={newRoute.cost.toString()} 
                onChange={(e) => setNewRoute({...newRoute, cost: parseFloat(e.target.value) || 0})}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRouteDialog(false)}>Cancel</Button>
            <Button onClick={handleAddRoute} disabled={addRouteMutation.isPending}>
              {addRouteMutation.isPending ? 'Adding...' : 'Add Route'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HubDetailsPage;
